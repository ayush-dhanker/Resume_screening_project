import styles from "./BubbleText.module.css";

const BubbleText = ({ text }) => {
    return (
        <p className="text-center text-5xl font-thin text-indigo-300" style={{ marginBottom: 0 }}>
            {text.split("").map((child, idx) => (
                <span className={styles.hoverText} key={idx}>
                    {child}
                </span>
            ))}
        </p>
    );
};

export default BubbleText;