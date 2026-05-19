const Skeleton = ({ className = "", as: Component = "div", ...props }) => (
  <Component
    className={`skeleton ${className}`.trim()}
    aria-hidden="true"
    {...props}
  />
);

export default Skeleton;
