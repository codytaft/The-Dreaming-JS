saveDreamToDatabase = async (date, dream) => {
  try {
    const url = `http://localhost:3446/api/v1/dreams`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: date,
        dream: dream
      })
    });
    const newDream = await response.json();
    return await newDream;
  } catch (error) {
    console.log(error);
  }
};

getAllDreams = async () => {
  try {
    const url = `http://localhost:3446/api/v1/dreams`;
    const response = await fetch(url);
    const data = await response.json();
    return await Promise.resolve(data);
  } catch (error) {
    console.log(error);
  }
};