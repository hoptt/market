import Container from "@/components/layout/Container";
import classNames from "classnames";
import Likes from "./_components/Likes";
import Recent from "./_components/Recent";
import styles from "./style.module.scss";

export default function Aside() {
  return (
    <Container className="relative">
      <aside
        className={classNames(
          styles.aside,
          "absolute flex flex-col gap-2 w-24 top-8"
        )}
      >
        <Likes />
        <Recent />
      </aside>
    </Container>
  );
}
