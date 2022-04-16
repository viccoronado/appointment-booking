const defaultPhone = +5493517863880

export const contactMe = (phoneNumber, message, name) => {
    return function () {
        if (!message && !phoneNumber) {
            if (name) {
                window.open(
                    `https://wa.me/${defaultPhone}?text=¡Hola Victoria y Carla! Soy ${name}, les escribo a través del sitio web`,
                    '_blank'
                );
            } else {
                window.open(
                    `https://wa.me/${defaultPhone}?text=¡Hola Victoria y Carla! Me contacto desde su sitio web`,
                    '_blank'
                );
            }
        } else {
            window.open(
                `https://wa.me/549${phoneNumber}?text=${message || ''}`,
                '_blank'
            );
        }
    }
}

export const sendMessage = (mensaje, tel, turno) => {
    return function () {
        let msg = mensaje.replace("HORA", `*${turno} hs*`)
        window.open(
            `https://wa.me/549${tel}?text=${msg}`,
            '_blank'
        );
    }
}