"use client";

import axios from "axios";
import { useId, useState } from "react";

import urls from "@/config/urls";

const checkValue = (key, object) => {
  return !!object?.[key];
};

const ContactForm = () => {
  const [formDetails, setFormDetails] = useState({});
  const [responseData, setResponseData] = useState(null);
  const submitHandler = async (event) => {
    event.preventDefault();

    const isNamePresent = checkValue("name", formDetails);
    const isEmailPresent = checkValue("email", formDetails);
    const isMessagePresent = checkValue("message", formDetails);

    if (!isNamePresent) {
      alert("name is required");
      return;
    }
    if (!isEmailPresent) {
      alert("Email is required");
      return;
    }
    if (!isMessagePresent) {
      alert("Message is required");
      return;
    }

    // Given API
    try {
      const response = await axios.post(
        "https://www.greatfrontend.com/api/questions/contact-form",
        formDetails
      );

      const data = response.data;
      console.log(`data: ${data}`);

      alert(`API response: ${data}`);
    } catch (error) {
      console.error("New API Error: ", error);
    }

    // Local host request
    try {
      const response = await axios.post(
        urls.backend + "/contact-form",
        formDetails
      );

      const data = response.data;

      if (data.status === "success") {
        alert("form submitted successfully");

        console.log("Response Data: ", data);
        setResponseData(data);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  return (
    <div>
      <h1 className="text-xl font-bold">Contact Form</h1>
      <div className="w-full max-w-lg">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4 p-4 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <MyInput
            name="name"
            placeholder="Name"
            required
            onChange={(event) => {
              const value = event.target.value;
              setFormDetails((prevValue) => {
                return { ...prevValue, name: value };
              });
            }}
          />
          <MyInput
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={(event) => {
              const value = event.target.value;
              setFormDetails((prevValue) => {
                return { ...prevValue, email: value };
              });
            }}
          />
          <MyTextArea
            name="message"
            placeholder="Message"
            required
            onChange={(event) => {
              const value = event.target.value;
              setFormDetails((prevValue) => {
                return { ...prevValue, message: value };
              });
            }}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
      </div>

      {!!responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
    </div>
  );
};

const MyInput = ({ name, placeholder, label, type, ...props }) => {
  const id = useId();
  return (
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label || placeholder || name}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder || name}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        {...props}
      />
    </div>
  );
};

const MyTextArea = ({ name, placeholder, label, type, ...props }) => {
  const id = useId();
  return (
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>
        {label || placeholder || name}
      </label>
      <textarea
        type={type}
        name={name}
        placeholder={placeholder || name}
        {...props}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-[150px]"
      />
    </div>
  );
};

export default ContactForm;
