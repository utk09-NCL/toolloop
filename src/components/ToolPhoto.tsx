import styles from "./ToolPhoto.module.css";

type ToolPhotoProps = {
  toolName: string;
  avatarColor: string;
  size?: "sm" | "md" | "lg";
};

export function ToolPhoto({ toolName, avatarColor, size = "md" }: ToolPhotoProps) {
  const letter = toolName.trim()[0]?.toUpperCase() ?? "?";
  return (
    <div
      className={[styles.photo, styles[size]].join(" ")}
      style={{ background: avatarColor }}
      aria-hidden="true"
    >
      <span className={styles.letter}>{letter}</span>
    </div>
  );
}
