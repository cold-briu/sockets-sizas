const socket = io(); //acá iría la url del externo

let local_users = {}
let currentChat = ""
let currentUser = "not yet";
const createHtmlElement = (text, elementName, clases) => {

    const txt = document.createTextNode(text)
    const container = document.createElement(elementName)
    container.appendChild(txt)
    container.className = clases;

    return container
}

const newUser = async () => {
    socket.emit('new-user', await prompt("tell us ur name"))
    await console.log(`You Joined!`)
}

const handleSubmit = () => {
    document.querySelector('#formulario').addEventListener('submit', e => {
        e.preventDefault()

        const output = document.querySelector('#messages_list')
        const msg = document.querySelector('#message_input')

        socket.emit('new-msg', msg.value)
        output.appendChild(createHtmlElement(`You said: ${msg.value}`, "LI", "text-muted text-right"))
        msg.value = ''
    });

}

const handleTyping = () => {
    document.querySelector('#message_input').addEventListener('keypress', () => {
        socket.emit('typing', null)
    })
}

const printUsers = async () => {
    let output = document.querySelector('#users_list')
    output.innerHTML = ""

    for (let id in local_users) {
        await output.appendChild(createHtmlElement(local_users[id].name, "LI", `btn btn-outline-success btn-sm btn-block text-center user_container ${id}`))
        handleSelectUser(id)
    }
}

const handleSelectUser = (id) => {

    document.querySelector(`.${id}`).addEventListener('click', e => {
        e.preventDefault()
        let container = document.querySelector(`.${id}`)
        currentChat = container.innerHTML

        try {
            let output = document.querySelector('#chat_actual_container')
            output.innerHTML = ""
            output.appendChild(createHtmlElement(currentChat, "H2", ""))
        } catch (err) {
            console.error(`failed on ${id}`, err)
        }
    })

}


newUser()
handleSubmit()
handleTyping()




socket.on('global-msg', incoming => {
    document.querySelector('#messages_list').appendChild(createHtmlElement(`${incoming.name}: ${incoming.message}`, "LI", "light text-left"))
    document.querySelector('#notification').innerHTML = ""
})

socket.on('isTyping', name => {
    document.querySelector('#notification').innerHTML = name + " is typing"
})

socket.on('user-joined', users => {
    local_users = { ...users }
    printUsers()
})
