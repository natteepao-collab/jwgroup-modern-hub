import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import jwLogo from '@/assets/jw-group-logo.png';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/faq-chat`;

const FAQChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'สวัสดีครับ! ผมเป็นผู้ช่วย FAQ ของ JW Group ยินดีให้บริการครับ มีอะไรให้ช่วยไหมครับ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok || !resp.body) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to get response");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && prev.length > 1) {
                return prev.map((m, i) => 
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      await streamChat(newMessages.slice(1)); // Skip initial greeting
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง หรือติดต่อ 02-234-5678' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'มีข่าวสารอะไรใหม่บ้าง?',
    'มีตำแหน่งงานว่างอะไรบ้าง?',
    'บริษัทได้รับรางวัลอะไรบ้าง?',
    'ติดต่อบริษัทได้อย่างไร?',
  ];

  const handleToggleButton = () => {
    if (isButtonVisible) {
      setIsOpen(!isOpen);
    } else {
      setIsButtonVisible(true);
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-300",
          isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">JW Group FAQ</h3>
              <p className="text-xs text-primary-foreground/80">ผู้ช่วยตอบคำถาม</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-primary-foreground/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[350px] p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex gap-2",
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={jwLogo} alt="JW Group" className="w-6 h-6 object-contain" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  )}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <img src={jwLogo} alt="JW Group" className="w-6 h-6 object-contain" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">คำถามยอดนิยม:</p>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q);
                  }}
                  className="block w-full text-left text-sm px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-foreground"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์คำถามของคุณ..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Slide-out Assistant Tab - Reference design style */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
        <div
          className={cn(
            "flex items-center transition-all duration-300 ease-out",
            isButtonVisible
              ? "translate-x-0"
              : "translate-x-[calc(100%-24px)]"
          )}
        >
          {/* Toggle Handle - Chevron */}
          <button
          onClick={() => setIsButtonVisible(!isButtonVisible)}
            className={cn(
              "flex items-center justify-center w-6 h-16 rounded-l-lg shadow-lg transition-all duration-300 bg-card border border-r-0 border-border hover:bg-muted"
            )}
            aria-label={isButtonVisible ? 'ซ่อนช่วยเหลือ' : 'แสดงช่วยเหลือ'}
          >
            <ChevronLeft className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-300",
              isButtonVisible ? "" : "rotate-180"
            )} />
          </button>

          {/* Main Assistant Panel */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-l-xl shadow-lg transition-all duration-300 bg-card border border-r-0 border-border",
              isOpen
                ? "bg-muted"
                : "hover:bg-muted/50"
            )}
            aria-label={isOpen ? 'ปิดแชท' : 'เปิดแชท FAQ'}
          >
            {/* Logo */}
            <img 
              src={jwLogo} 
              alt="JW Group" 
              className="w-10 h-10 object-contain"
            />
            
            {/* Text */}
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-foreground tracking-wide">
                <span className="text-primary">JW</span>
                <span className="text-muted-foreground">GROUP</span>
              </span>
              <span className="text-xs font-semibold text-primary tracking-widest">
                ASSISTANT
              </span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default FAQChatbot;
