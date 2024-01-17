export const fakeAuth = (formData) => {
  console.log("got here 2", formData);
  if (
    formData &&
    formData.username === "bj" &&
    formData.password === "pass424"
  ) {
    // new Promise((resolve) => {
    //   setTimeout(() => resolve("2342f2f1d131rf12"), 250);
    // });
    return "2342f2f1d131rf12";
  } else {
    // new Promise((resolve) => {
    //   setTimeout(() => resolve(null), 250);
    // });
    return null;
  }
};
