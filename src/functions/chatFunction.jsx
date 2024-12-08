import config from "../config";
const chatURI = config.chatURI;

export const sendMsg = async (data) => {
  try {
    const response = await fetch(chatURI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({content:data}),
    });

    if (!response.ok) {
    //   throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    // console.log('Success:', responseData);
  } catch (error) {
    // console.error('Error:', error);
  }
};