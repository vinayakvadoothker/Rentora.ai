import React from 'react';

const VenturePage = () => {
  const pageContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: 'rgba(255, 255, 255, 0)',
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
        <h1>Venture Options - Coming Soon!</h1>
        <p>
          We're excited to announce that the ability to venture short-term rentals is in development.
          Here are some of the features we have planned:
        </p>
        <div style={listItemContainerStyle}>
          <span style={italicizedStyle}>Buy and sell your dates for a higher or lower price</span>
        </div>
        <div style={listItemContainerStyle}>
          <span style={italicizedStyle}>Similar to stocks, trade your short-term rental options</span>
        </div>
        <div style={listItemContainerStyle}>
          <span style={italicizedStyle}>Experience the flexibility of a stock market for your rental dates</span>
        </div>
        <p>
          Stay tuned for updates on our progress and the launch of this exciting new feature!
        </p>
      </div>
    </div>
  );
};

export default VenturePage;
