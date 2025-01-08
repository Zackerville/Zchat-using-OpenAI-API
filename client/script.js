import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loading(element)
{
    element.textContent = '';

    loadInterval = setInterval(() => 
    {
        element.textContent += '.';

        if(element.textContent === '...') element.textContent = '';
    }, 300)
}

function typeText(element, text)
{
    let index = 0;
    let interval = setInterval(() =>
    {
        if(index < text.length) 
        {
            element.innerHTML += text.CharAt(index);
            index++;
        }
        else
        {
            clearInterval(interval);
        }
    }, 20)
}

function generateID()
{
    const timestamp = Date.now();
    const randomNum = Math.random();
    const hexaStr = randomNum.toString(16);

    return `id-${timestamp}-${hexaStr}`;
}

function chatStripe (isAI, value, uniqueID)
{
    return (
        `
            <div class="wrapper ${isAI && 'ai'}">
                <div class="chat">
                    <div class="profile">
                        <img
                            src="${isAI ? bot : user}"
                            alt="${isAI ? 'bot' : 'user'}"
                        />
                    </div>
                    <div class="message" id=${uniqueID}>${value}</div>
                </div>
            </div>
        `
    )
}

const handleSubmit = async (e) =>
{
    e.preventDefault();

    const data = new FormData(form);

    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
    form.reset();

    const uniqueID = generateID();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueID);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueID);
    loading(messageDiv);
}

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if(e.keyCode === 13) handleSubmit(e);
})