import React, { PropsWithChildren } from "react";
import s from "./Content.module.scss";
import picturePath from "./image.png";

type Props = PropsWithChildren;

export const Content = ({ children }: Props) => {
  return (
    <section className={s.content}>
      <img src={picturePath} alt="image" />

      {children}
    </section>
  );
};
