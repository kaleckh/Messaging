export const post = async ({ url, body }: { url: string; body: any }) => {
    try {
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return await result.json();
    } catch (error) {
      console.log(error, "this is an error");
    }
  };
  