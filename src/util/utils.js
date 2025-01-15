import axios from "axios";

export function convertKeysToLowercase(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    let newKey = String(key).charAt(0).toLowerCase() + String(key).slice(1);
    acc[newKey] = obj[key];
    return acc;
  }, {});
}

export function urlBuilder(directory, params) {
  let url = directory;
  for (const key in params) {
    url += `&${key}=${params[key]}`;
  }
  return url;
}

export async function submitForm(url, input, setErrors, token) {
  try {
    return await axios.post(process.env.REACT_APP_API_BASE_URL + url, input,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
  } catch (error) {
    let respErrors = error.response.data.errors
    if (!respErrors){
      if (error.response.data.statusCode === 400){
        let generalErrors = error.response.data.map((err) => err.description)
        if (generalErrors.length === 0){
          generalErrors = ["Something went wrong"]
        }
        respErrors = {general: generalErrors.join("\n")}
      }else{
        respErrors = {general: "Server error"}
        console.log(error.response)
      }
    }
    respErrors = convertKeysToLowercase(respErrors)
    setErrors(respErrors)
    return undefined;
  }
}

export async function authGet(url, token){
  return await axios.get(url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
}