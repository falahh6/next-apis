"use client";

import { Button } from "antd";
import { useState } from "react";

import { useCompletion } from "ai/react";

export default function Home() {
  const [videoId, setVideoId] = useState("");

  const {
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion();
  const generateVideoHeygen = () => {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key":
          "MTE2NTA5M2I0MWMyNDAwYWJkNzYzY2ZhYTdmY2Q0MDgtMTcxMDk5OTQxNQ==",
      },
      body: JSON.stringify({
        background: "#ffffff",
        clips: [
          {
            avatar_id: "Daisy-inskirt-20220818",
            avatar_style: "normal",
            input_text: "Welcome to movio API",
            offset: { x: 0, y: 0 },
            scale: 1,
            voice_id: "131a436c47064f708210df6628ef8f32",
            talking_photo_id: "string",
            talking_photo_style: "normal",
          },
        ],
        ratio: "16:9",
        test: true,
        caption_open: false,
        version: "v1alpha",
        callback_id: "string",
      }),
    };

    fetch("https://api.heygen.com/v1/video.generate", options)
      .then((response) => response.json())
      .then((response) => {
        console.log();
        const videoId = response.data.video_id;
        setVideoId(videoId);
      })
      .catch((err) => console.error(err));
  };

  const retriveVideoHygen = () => {
    const options3 = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key":
          "MTE2NTA5M2I0MWMyNDAwYWJkNzYzY2ZhYTdmY2Q0MDgtMTcxMDk5OTQxNQ==",
      },
    };

    fetch(
      `https://api.heygen.com/v1/video_status.get?video_id=${videoId}`,
      options3
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };

  const getKindeAcessToken = () => {
    fetch(`https://coachbots.kinde.com/oauth2/token`, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        audience: "https://coachbots.kinde.com/api",
        grant_type: "client_credentials",
        client_id: "970e03b896124b4b87439ca80dd044e9",
        client_secret: "NWWvylUiuLOAgzXtRhEXeru7do4wJFresFpdHQnZbkwTWNNfDkUe",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const access_token = data.access_token;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
          "Access-Control-Allow-Origin": "https://coachbots.kinde.com",
        };

        fetch("https://coachbots.kinde.com/api/v1/users", {
          method: "GET",
          headers: headers,
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (body) {
            console.log(body);
          });
      });
  };

  function ensureProperEnding(str: string) {
    // console.log(str)
    if (str.startsWith("[") && !str.endsWith("]")) {
      console.log("met condition 1");
      return str.replace("[", "");
    } else if (
      str.startsWith(",") &&
      !str.startsWith("[") &&
      !str.endsWith("]")
    ) {
      console.log("met condition 2");
      return str.replace(",", "");
    } else if (str.endsWith("]")) {
      console.log("met condition 3");
      return str.replace(/^\s*,/, "").replace(/\]\s*$/, "");
    } else {
      console.log("met condition DE");
      return str;
    }
  }

  // const [input, setInput] = useState<string>("");

  return (
    <main className="flex min-h-screen w-full flex-col p-24 bg-white gap-2">
      {/* <p className="text-gray-600"> Hello bun Netxjs</p> */}
      {/* <Button
        onClick={() => {
          getKindeAcessToken();
        }}
      >
        Get Kinde Access Token
      </Button> */}
      {/* <Button
        onClick={() => {
          retriveVideoHygen();
        }}
      >
        Retrive video
      </Button> */}
      {/* <Button
        onClick={() => {
          generateVideoHeygen();
        }}
      >
        Generate video
      </Button>
      <Button
        onClick={() => {
          retriveVideoHygen();
        }}
      >
        Retrive video
      </Button> */}
    </main>
  );
}
