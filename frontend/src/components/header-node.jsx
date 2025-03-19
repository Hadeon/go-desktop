const HeaderNode = ({ onClick, style }) => {
  return (
    <div
      className="header-node"
      onClick={onClick}
      style={{ ...style, cursor: "pointer" }}
    >
      <div className="header-node-circle"></div>
    </div>
  );
};

export default HeaderNode;
