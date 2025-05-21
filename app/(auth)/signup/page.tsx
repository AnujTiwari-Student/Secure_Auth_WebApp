"use client";
import axios from "axios";

const signup = async (e: React.FormEvent<HTMLFormElement>) => {

    const fromData = new FormData(e.target as HTMLFormElement);
    let data = Object.fromEntries(fromData.entries());
    console.log("Data from register", data);

    const mutation = `
    mutation CreateUser($data: UserInput!) {
        createUser(data: $data) {
            id
            name
            email
        }
      }
    `;

    const variables = {
      data: {
        name: data.name,
        email: data.email,
        password: data.password
      }
    };

  try {
    const response = await axios.post("/api/graphql", {
        query: mutation,
        variables: variables,
        }, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error("Network response was not ok");
    }

    if (response.status === 200) {
        console.log("GraphQL request successful");
        window.location.href = "/home";
    }

    const result = response.data;
    console.log("GraphQL Response:", result);

    //@ts-ignore
    if (result.data?.createUser) {
        //@ts-ignore
      console.log("User created:", result.data.createUser);
    //   window.location.href = "/signup";
    } else {
        //@ts-ignore
      console.error("GraphQL error:", result.errors);
    }

  } catch (error) {
    console.error("Signup error:", error);
  }

}

export default function Register() {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await signup(e);
    };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="w-full max-w-md px-6 py-12 space-y-8 bg-white rounded-lg shadow-md sm:px-10">
        
        <div className="text-center">
          <h1 className="text-4xl font-bold">Register</h1>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}