export default function InputLabel({
    value,
    className = "",
    children,
    ...props
}) {
    return (
        <label {...props} className={`block  dark:text-white ` + className}>
            {value ? value : children}
        </label>
    );
}
