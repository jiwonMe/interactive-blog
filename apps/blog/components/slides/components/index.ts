import { Steps } from "./steps";
import { Notes } from "./notes";
import { Layout, Center, Split, Full, ImageBg } from "./layouts";

export const slideComponents = {
  Steps,
  Notes,
  Layout,
  "Layout.Center": Center,
  "Layout.Split": Split,
  "Layout.Full": Full,
  "Layout.ImageBg": ImageBg,
};

export { Steps, Notes, Layout };
