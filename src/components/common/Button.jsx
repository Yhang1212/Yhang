const Button = ({ children, variant = 'primary' }) => {
  const styles = {
    primary: {
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      padding: '0.8rem 1.2rem',
      borderRadius: '999px',
      fontWeight: 600,
    },
    secondary: {
      background: 'transparent',
      color: '#2563eb',
      border: '1px solid #2563eb',
      padding: '0.8rem 1.2rem',
      borderRadius: '999px',
      fontWeight: 600,
    },
  };

  return <button style={styles[variant]}>{children}</button>;
};

export default Button;
