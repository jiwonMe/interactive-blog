import { type ReactNode } from "react";
import { Center } from "./center";
import { Split } from "./split";
import { Full } from "./full";
import { ImageBg } from "./image-bg";

type LayoutProps = {
  children: ReactNode;
};

function LayoutBase({ children }: LayoutProps) {
  return <>{children}</>;
}

export const Layout = Object.assign(LayoutBase, {
  Center,
  Split,
  Full,
  ImageBg,
});

export type { LayoutProps };
