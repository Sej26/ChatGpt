import { useState, useEffect } from 'react';
import send from "./assets/send.svg";
import loadingIcon from "./assets/loader.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import axios  from "axios";

function App() {
  const [input,setInput]= useState("");
  const [posts,setPosts]=useState([]);
  
useEffect(()=> {
   document.querySelector(".layout").scrollTop=
   document.querySelector(".layout").scrollHeight;
},[posts])

  const fetchBotResponse=async() => {
       const {data}= await axios.post(
        "https://chatgpt-my1w.onrender.com",
        {input},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
       );
       return data;
  };
  const onSubmit=() => {
    if(input.trim()=== "") return ;
    updatePosts(input);
    updatePosts("loading...",false,true);
    setInput("");
    fetchBotResponse().then((res)=> {
      console.log(res);
      updatePosts(res.bot.trim(),true);
    });

  };

  const autoTypingBotResponse=(text)=> {
       let index=0;
       let interval=setInterval(() => {
           if(index<text.length) {
            setPosts((prev) => {
              let lastItem= prev.pop();
              if(lastItem.type!= "bot") {
                  prev.push({
                    type: "bot",
                    post: text.charAt(index-1)
                  })
              }
              else {
                prev.push({
                  type: "bot",
                  post: lastItem.post+ text.charAt(index-1)
                })
              }
              return [...prev];
            });
            index++;
           }
           else {
            clearInterval(interval);
           }
       },30);
  }

  const updatePosts=(post,isBot,isLoading) => {
    if(isBot) {
      autoTypingBotResponse(post);
    }
    else {
      setPosts((prev) => {
        return [
          ...prev,
          {type: isLoading ? "loading":"user" , post}
        ];
      });
  
    }
    
  }

  const onkeyup=(e) => {
          if(e.key=== "Enter" || e.which=== 13) {
            onSubmit();
          }
  }

  return (
    
<main className='chatGPT-app'>
<section className='chat-container'>
  <div className='layout'>
    {posts.map((post , index)=> (
      <div 
      key={index}
      className = {`chat-bubble ${
                                post.type === "bot" || post.type === "loading"
                                    ? "bot"
                                    : ""
                            }`}
      >
      <div className='avatar'>
      <img src={
        post.type=== "bot" || post.type=="loading" ? bot: user
      } />
      </div>
      {post.type=== "loading" ? (
        <div className="loader">
        <img src={loadingIcon} />
        </div>
      ):(
        <div className='post'>
        {post.post}
      </div>
      )}
      </div>
    ))}
    
    </div>
  
</section>
<footer>
  <input
  value={input}
  className='composebar'
  autoFocus
  type='text'
  placeholder='Type your question!'
  onChange={(e)=> setInput(e.target.value)}
  onKeyUp={onkeyup}
  />
  <div className='send-button' onClick={onSubmit}>
  <img src={send}/>

  </div>
</footer>

</main>
        
    
  );
}

export default App;
