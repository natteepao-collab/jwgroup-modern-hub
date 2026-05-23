import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, X, Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import jwLogo from '@/assets/jw-group-logo.png';




interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/faq-chat`;

// Persistent session id per browser (for marketing analytics)
const getSessionId = (): string => {
  try {
    let sid = localStorage.getItem('jw_chat_session_id');
    if (!sid) {
      sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('jw_chat_session_id', sid);
    }
    return sid;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
};

const FAQChatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('chatbot.greeting') }
  ]);
  const [input, setInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(getSessionId());

  // Respect prefers-reduced-motion for accessibility
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

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
      body: JSON.stringify({
        messages: userMessages,
        sessionId: sessionIdRef.current,
        language: typeof navigator !== 'undefined' ? navigator.language : 'th',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      }),
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
        { role: 'assistant', content: t('chatbot.error') }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    t('chatbot.qNews'),
    t('chatbot.qJobs'),
    t('chatbot.qAwards'),
    t('chatbot.qContact'),
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
          "fixed bottom-24 right-6 z-[70] w-[360px] max-w-[calc(100vw-3rem)] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden transition-all duration-300",
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
              <h3 className="font-bold text-sm">{t('chatbot.title')}</h3>
              <p className="text-xs text-primary-foreground/80">{t('chatbot.subtitle')}</p>
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
        <ScrollArea className="h-[350px] p-4 [&>[data-radix-scroll-area-viewport]]:overscroll-contain" ref={scrollRef}>
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
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed",
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ul:pl-4 prose-li:my-0.5 prose-strong:text-foreground prose-strong:font-semibold">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
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
              <p className="text-xs text-muted-foreground">{t('chatbot.popular')}</p>

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
              placeholder={t('chatbot.placeholder')}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Slide-out Assistant Tab - Premium Luxury Style */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[70]">
        <div
          className={cn(
            "flex items-center transition-all duration-500 ease-out",
            isButtonVisible
              ? "translate-x-0"
              : "max-sm:translate-x-[calc(100%-20px)] sm:translate-x-[calc(100%-24px)]"
          )}
        >
          {/* Toggle Handle - Chevron */}
          <button
            onClick={() => setIsButtonVisible(!isButtonVisible)}
            className="group flex items-center justify-center max-sm:w-5 max-sm:h-16 sm:w-6 sm:h-20 rounded-l-xl transition-all duration-300 bg-gradient-to-b from-primary to-primary/90 hover:from-accent hover:to-accent/90 shadow-[−4px_0_12px_rgba(15,23,42,0.15)]"
            aria-label={isButtonVisible ? 'ซ่อนช่วยเหลือ' : 'แสดงช่วยเหลือ'}
          >
            <ChevronLeft className={cn(
              "w-4 h-4 text-primary-foreground transition-transform duration-300 group-hover:scale-110",
              isButtonVisible ? "" : "rotate-180"
            )} />
          </button>

          {/* Main Assistant Panel - Luxury Glass Card */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (isOpen) {
                    setIsOpen(false);
                  } else {
                    setIsOpen(true);
                    setIsButtonVisible(false);
                  }
                }}
                className={cn(
                  "group relative flex items-center max-sm:gap-2 max-sm:pl-2.5 max-sm:pr-3 max-sm:py-2 sm:gap-3 sm:pl-4 sm:pr-5 sm:py-3.5 rounded-l-2xl transition-all duration-500 overflow-hidden",
                  "bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-card/95 dark:via-card/90 dark:to-card/85",
                  "backdrop-blur-xl border border-r-0 border-white/40 dark:border-white/10",
                  "shadow-[-8px_0_30px_-8px_rgba(15,23,42,0.25)] hover:shadow-[-12px_0_40px_-8px_rgba(212,129,42,0.35)]",
                  "hover:-translate-x-0.5",
                  isOpen && "shadow-[-12px_0_40px_-8px_rgba(212,129,42,0.45)]"
                )}
                aria-label={isOpen ? 'ปิดแชท' : 'เปิดแชท FAQ'}
              >
                {/* Animated gradient sheen - hidden when reduced motion preferred */}
                {!prefersReducedMotion && (
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}
                
                {/* Top accent line */}
                <span className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

                {/* Logo with glow ring */}
                <div className="relative flex-shrink-0">
                  {!prefersReducedMotion && (
                    <span className="absolute inset-0 rounded-full bg-accent/20 blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  )}
                  <div className="relative max-sm:w-9 max-sm:h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-white to-muted/30 flex items-center justify-center ring-1 ring-primary/10 shadow-inner">
                    <img 
                      src={jwLogo} 
                      alt="JW Group" 
                      className={cn(
                        "object-contain",
                        "max-sm:w-7 max-sm:h-7 sm:w-9 sm:h-9",
                        !prefersReducedMotion && "transition-transform duration-500 group-hover:scale-110"
                      )}
                    />
                  </div>
                  {/* Pulse status dot */}
                  <span className="absolute -top-0.5 -right-0.5 flex max-sm:h-2 max-sm:w-2 sm:h-2.5 sm:w-2.5">
                    {!prefersReducedMotion && (
                      <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                    )}
                    <span className="relative inline-flex h-full w-full rounded-full bg-accent ring-2 ring-background" />
                  </span>
                </div>
                
                {/* Text */}
                <div className="relative flex flex-col items-start leading-tight">
                  <span className="max-sm:text-[11px] sm:text-[13px] font-extrabold tracking-[0.15em]">
                    <span className="text-primary">JW</span>
                    <span className="text-muted-foreground/80">GROUP</span>
                  </span>
                  <span className="max-sm:text-[8px] sm:text-[10px] font-bold text-accent tracking-[0.28em] mt-0.5">
                    ASSISTANT
                  </span>
                  <span className="flex items-center gap-1 mt-0.5">
                    <span className={cn(
                      "max-sm:h-0.5 max-sm:w-0.5 sm:h-1 sm:w-1 rounded-full bg-emerald-500",
                      !prefersReducedMotion && "animate-pulse"
                    )} />
                    <span className="max-sm:text-[7px] sm:text-[8px] font-medium text-muted-foreground tracking-wider uppercase">Online</span>
                  </span>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" align="center" className="max-w-[220px]">
              <p className="text-xs">{isOpen ? 'ปิดหน้าต่างแชท' : 'คลิกเพื่อสนทนากับ JW Group Assistant'}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
};

export default FAQChatbot;
