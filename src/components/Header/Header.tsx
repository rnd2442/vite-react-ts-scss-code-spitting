import React, { PropsWithChildren } from "react";
import s from "./Header.module.scss";
import closeSvgPath from "./close.svg";

type Props = PropsWithChildren;

export const Header = ({ children }: Props) => {
  return (
    <header className={s.header}>
      {children}
      <img src={closeSvgPath} alt="close" className={s.close} />
    </header>
  );
};
