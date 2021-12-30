/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { saveAs } from "file-saver";
import Head from "next/head";

const Index = () => {
  const [image, setImage] = useState("");

  function removeEmojis(string) {
    let regex =
      /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    return string.replace(regex, "");
  }

  function getTop10(string) {
    const words = string.split(" ");
    const wordCount = {};
    words.forEach((word) => {
      if (word.length !== 0) {
        if (wordCount[word]) {
          wordCount[word]++;
        } else {
          wordCount[word] = 1;
        }
      }
    });

    const sortedWordCount = Object.keys(wordCount).sort((a, b) => {
      return wordCount[b] - wordCount[a];
    });
    return sortedWordCount.slice(0, 10);
  }

  function handleChange(file) {
    let final = "";

    // all messages
    const messages = file.split("\n");

    // chatted users
    const users = [];
    messages.forEach((message) => {
      if (users.length < 3) {
        users.push(message.split("-").pop().split(":")[0]);
      }
    });

    messages.forEach((line) => {
      // if line has <Media omitted> remove the line
      if (line.includes("<Media omitted>")) {
        return;
      }
      // remove words between starting character and the second colon :
      const list = line.split(":");
      // remove first 2 items in list
      list = list.slice(2, list.length).join(" ");
      if (!list.includes("<Media omitted>")) {
        final += list + " ";
      }
    });
    // find the most used words in the file
    // and return the top 10
    const emojis = final.match(/[\p{Emoji}\u200d]+/gu);
    final = removeEmojis(final).replace(/\s\s+/g, " ");

    const top10text = getTop10(final);

    const top10emoji = getTop10(emojis.join(" "));

    setImage(`
    https://og-image.vercel.app/**WhatsApp wrapped**%20%3Cbr%2F%3E%20${
      "--------------------------------------<br%2F>%20" +
      users[1].trim() +
      " 🖐🏻 " +
      users[2].trim() +
      "Chat %20summary" +
      "<br%2F>%20--------------------------------------<br%2F>%20" +
      "**Total messages**: " +
      messages.length +
      "<br%2F>%20" +
      "**Total emojis**: " +
      emojis.length +
      "<br%2F>%20" +
      "**Most used words**: " +
      top10text.filter((e) => e.length > 1).join(", ") +
      "<br%2F>%20" +
      "**Most used emojis**: " +
      top10emoji.filter((e) => e.length > 1).join(", ") +
      "<br%2F>%20" +
      "--------------------------------------<br%2F>%20" +
      "`made my manitej ⚡️`"
    }.png?theme=dark&md=1&fontSize=50px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg&widths=0&heights=0
    `);
  }

  return (
    <div>
      <Head>
        <title>WhatsApp Chat wrapped</title>
        <meta
          property="og:image"
          content="https://og-image.vercel.app/**WhatsApp%20wrapped**.png?theme=dark&md=1&fontSize=100px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fhyper-bw-logo.svg&widths=50&heights=50"
        />
      </Head>
      <nav className="navbar">
        <h3>Whatsapp wrapped 🍰</h3>
        <Link href="https://github.com/Manitej66/whatsapp-wrapped">GitHub</Link>
      </nav>
      <div className="container">
        <input
          type="file"
          name="file"
          id="file"
          hidden
          accept="text"
          onChange={(e) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              handleChange(e.target.result);
            };
            reader.readAsText(e.target.files[0]);
          }}
        />
        <label className="btn" htmlFor="file">
          Upload chat export txt
        </label>

        {image && (
          <>
            <div className="image">
              {image && <img src={image} width="100%" alt="pic" />}
            </div>

            <button
              className="btn"
              onClick={() => saveAs(image, "WhatsApp.png")}
            >
              Download
            </button>
            <a
              href={`https://wa.me://send?=91text=` + encodeURIComponent(image)}
              className="btn"
              style={{
                backgroundColor: "green",
              }}
            >
              Share on WhatsApp
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
