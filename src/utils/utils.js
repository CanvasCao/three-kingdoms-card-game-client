const getRelativePositionToCanvas = (gameObject, camera) => {
    return {
        x: (gameObject.x - camera.worldView.x) * camera.zoom,
        y: (gameObject.y - camera.worldView.y) * camera.zoom
    }
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const getMyUserId = () => {
    const key = 'three-kingdom-user-id';
    const userid = localStorage.getItem(key);
    if (userid) {
        return userid
    } else {
        const newUUID = uuidv4()
        localStorage.setItem(key, newUUID);
        return newUUID;
    }
}

export {getMyUserId, uuidv4}