"use client";
import React, { useEffect, useRef, useState } from "react";
import { SendButton } from "../buttons/SendButton";
import Image from "next/image";
import { Session } from "next-auth";
import { SignOutButton } from "../buttons/SignOutButton";
import { signOut } from "next-auth/react";
import { Message } from "@/types/types";
import { io } from "socket.io-client";

const socket = io("https://socket-server-wrih.onrender.com");

const MessageField = ({ session }: { session: Session }) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isModalOn, setIsModalOn] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    socket.on("new_message", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("new_message");
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsModalOn(false);
      }
    };
    if (isModalOn) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOn]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
      console.log(data);
    };
    fetchMessages();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const message = {
        text,
        userId: session.user.id,
        user: {
          image: session.user.image,
          name: session.user.name,
        },
      };
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
        const newMessage = await res.json();
        socket.emit("send_message", newMessage);
        // setMessages((prevMessages) => [...prevMessages, newMessage]);
        setText("");
      } catch (error) {
        console.error("Can't post message", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleModal = () => {
    setIsModalOn(!isModalOn);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        return;
      }
      if (isComposing) {
        return;
      }
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <div className="w-full h-screen bg-[#7c7794] grid place-items-center">
      <div className="w-full h-screen sm:w-[95%] sm:h-[90%] max-w-[600px]  rounded-xl">
        <div className="w-full h-[88%] max-h-[600px] sm:max-h-[800px] bg-[#e9daff] sm:rounded-t-xl p-5 pb-0 flex flex-col gap-5 overflow-y-auto scroll-smooth">
          {messages.map((msg: Message) => (
            <div
              key={msg.id}
              className={`flex gap-2 items-center ${
                msg.userId === session.user.id ? "flex-row-reverse" : ""
              } `}
            >
              <Image
                src={msg.user.image ?? "/logos/defaultImage.png"}
                width={35}
                height={35}
                alt="投稿者画像"
                className="rounded-full"
              />
              <p className="bg-[#f7f7f7] inline-block p-3 rounded-xl text-sm">
                {msg.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} className="" />
        </div>
        <div className="w-full h-[12%] min-h-[70px] bg-[#f6f6f6] sm:rounded-b-xl flex p-3 pr-2 gap-2">
          <div className="flex-1 grid place-items-center relative">
            <button
              onClick={handleModal}
              className="rounded-full cursor-pointer hover:opacity-40"
              ref={buttonRef}
            >
              <Image
                src={session.user.image ?? "/logos/defaultImage.png"}
                alt="User Avatar"
                width={45}
                height={45}
                className="rounded-full"
              />
            </button>
            {isModalOn && (
              <div
                ref={modalRef}
                className="absolute w-50 h-35 bg-[#f3f3f3] rounded-2xl -top-40 left-1 p-3 flex flex-col gap-2 justify-center"
              >
                <p className="font-bold text-xl">{session.user.name}</p>
                <p className="text-sm font-semibold">{session.user.email}</p>
                <div className="flex gap-2">
                  <p className="font-semibold">Sign out</p>
                  <button
                    onClick={() => signOut()}
                    className="cursor-pointer hover:opacity-40"
                  >
                    <SignOutButton className="text-3xl text-purple-300" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex-9 flex gap-1">
            <textarea
              placeholder="メッセージを入力"
              className="bg-[#e9daff] flex-9 rounded-xl focus:outline-0 p-2 resize-none"
              value={text}
              name="text"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
            />
            {text.trim() && (
              <div className="flex-1 grid place-items-center">
                <button
                  type="submit"
                  className="cursor-pointer hover:opacity-40"
                >
                  <SendButton className="text-3xl text-[#ff9595]" />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageField;
