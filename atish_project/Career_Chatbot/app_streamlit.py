import streamlit as st
import requests
import base64
from PIL import Image
import io

if "messages" not in st.session_state:
    st.session_state.messages = []

st.title("Career Guidance Chatbot")

# Display past messages
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        if message["type"] == "text":
            st.markdown(message["content"])
        # elif message["type"] == "plotly_chart":
        #     st.plotly_chart(message["content"], key=f"plotly_chart_{st.session_state.messages.index(message)}") # Add key here
        elif message["type"] == "tree_image":
            decoded_image = base64.b64decode(message['content'])
            img = Image.open(io.BytesIO(decoded_image))
            st.markdown(
                f"""
                <div style="width: 100%; overflow-x: auto;">
                    <img src="data:image/png;base64,{message['content']}" style="display: block; max-width: none;">
                </div>
                """,
                unsafe_allow_html=True
            )
        elif message["type"] == "follow_up_questions":  # New: Display follow-up questions
            st.markdown("### Follow-up Questions:")
            for question in message["content"]:
                st.markdown(f"- {question}")

# User Input
if prompt := st.chat_input("What are your career questions?"):
    st.session_state.messages.append({"role": "user", "type": "text", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    response = requests.post("http://127.0.0.1:5000/ask", json={"query": prompt})

    if response.status_code == 200:
        data = response.json()
        bot_response = data["response"]
        # plotly_graph = data.get("plotly_graph", None)
        
        tree_image = data.get("tree_image", None)
        follow_up_questions = data.get("json_response", {}).get("followUpQuestions", [])  # Get follow up questions

        st.session_state.messages.append({"role": "assistant", "type": "text", "content": bot_response})
        with st.chat_message("assistant"):
            st.markdown(bot_response)

        # if plotly_graph:
        #     st.session_state.messages.append({"role": "assistant", "type": "plotly_chart", "content": plotly_graph})
        #     with st.chat_message("assistant"):
        #         st.plotly_chart(plotly_graph, key="assistant_plotly_chart") #added a key
                

        if tree_image:
            st.session_state.messages.append({"role": "assistant", "type": "tree_image", "content": tree_image})
            with st.chat_message("assistant"):
                decoded_image = base64.b64decode(tree_image)
                img = Image.open(io.BytesIO(decoded_image))
                st.markdown(
                    f"""
                    <div style="width: 100%; overflow-x: auto;">
                        <img src="data:image/png;base64,{tree_image}" style="display: block; max-width: none;">
                    </div>
                    """,
                    unsafe_allow_html=True
                )
        if follow_up_questions:  # New: Display follow-up questions
            st.session_state.messages.append({"role": "assistant", "type": "follow_up_questions", "content": follow_up_questions})
            with st.chat_message("assistant"):
                st.markdown("### Follow-up Questions:")
                for question in follow_up_questions:
                    st.markdown(f"- {question}")
    else:
        st.error("Something went wrong with the backend API.")
