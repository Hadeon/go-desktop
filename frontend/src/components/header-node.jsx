const HeaderNode = ({ key, text, onClick, style }) => {
  return (
    <div
      key={key}
      className="header-node"
      onClick={onClick}
      style={{ ...style, cursor: "pointer" }}
    >
      <div className="header-node-circle"></div>
    </div>
  );
};

export default HeaderNode;
