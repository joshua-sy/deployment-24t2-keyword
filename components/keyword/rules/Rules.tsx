import React from "react";
import styled from "styled-components";

interface RulesProps {
  title: string;
  content: string;
  onClose: () => void;
}

const parseText = (content: string) => {
  const newLineText = content.replace(/\n/g, '<br />');
  const redText = newLineText.replace(/\[red\](.*?)\[\/red\]/g, '<span style="color: #FF0000;">$1</span>');
  const greenText = redText.replace(/\[green\](.*?)\[\/green\]/g, '<span style="color: #05FF00;">$1</span>');
  return greenText;
};

const Rules: React.FC<RulesProps> = ({
  title,
  content,
  onClose,
}) => {
  return (
    <div className="relative">
      <img src="/crossIcon.png" alt="Cross Icon" onClick={onClose}
        className="w-10 h-10 absolute top-2 right-2 cursor-pointer" />
      <h2 className="text-4xl font-bold text-white text-center p-4">{title}</h2>
      <p className="text-lg text-white mt-0 font-bold px-6" dangerouslySetInnerHTML={{ __html: parseText(content) }} />
    </div >
  );
};

export default Rules;