import React from 'react';

const BuyPage = () => {
  const pageContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0)',
    overflow: 'hidden',
  };

  const contentStyle = {
    maxWidth: '600px',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.9)',
    fontFamily: 'monospace',
    fontSize: '16px',
    fontWeight: 'normal',
    lineHeight: '1.5',
    overflow: 'hidden',
  };

  const listItemContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '10px', // Adjust the spacing between items
  };

  const italicizedStyle = {
    fontStyle: 'italic',
  };

  return (
    <div style={pageContainerStyle}>
      <div style={contentStyle}>
        <h1>Buy Homes - Coming Soon!</h1>
        <p>
          We're excited to announce that the ability to buy homes is in development.
          Here are some of the features we have planned:
        </p>
        <div style={listItemContainerStyle}>
          <span style={italicizedStyle}>Buy your dream home with ease</span>
        </div>
        <div style={listItemContainerStyle}>
          <span style={italicizedStyle}>Invest by buying shares in a home</span>
        </div>
        <div style={listItemContainerStyle}>
          <span style={italicizedStyle}>Rent out homes you own with our long-term rental or short-term venture options</span>
        </div>
        <p>
          Stay tuned for updates on our progress and the launch of this exciting new feature!
        </p>
      </div>
    </div>
  );
};

export default BuyPage;
