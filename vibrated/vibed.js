var size = 150;
var t = 7;
var names = ["Stoya", "Alicia", "Danielle", "Stormy", "Teresa", "Sol\u00e9", "Amanda"];//&#233;
var pos = [];
var speed = [];
var speedNorm = 2.2;

var preloaded = 0;
var magic = 0;
var swap = 1;
var background = 1;
var intervalId;
var spread = 1;

function init() {
    for (n = 1; n <= t; n++) {
        pos[n - 1] = new Vector(getMaxX() / 2, getMaxY() / 2);
        speed[n - 1] = normalizeN(rotate(new Vector(1, 0), ((n + .111) * 2 * Math.PI) / t), speedNorm);
    }
    intervalId = window.setInterval('doMove()', 40);
    doClick(1 + Math.floor(Math.random() * t), null);
    for (n = 1; n <= t; n++) {
        getLady(n).style.visibility = 'visible';
    }
}


function preload() {
    if (preloaded == 1) {
        return;
    }
    im = new Image();
    for (n = 1; n <= t; n++) {
        im.src = '1' + n + '.png';
        im.src = '2' + n + '.png';
        im.src = '3' + n + '.png';
    }
    im.src = 'meditation_on.png';
    im.src = 'onair_bg.png';
    im.src = 'swap_off.png';
    preloaded = 1;
}

function isPlaying(n) {
    return (get('ifr' + n).src.indexOf("nothing.html") != -1 ? 0 : 1);
}

function getLady(n) {
    return get('lady' + n);
}

function get(id) {
    return document.getElementById(id);
}

function checkTitle(n) {
    play = isPlaying(n);
    if (magic == 0) {
        getLady(n).title = (play == 0 ? 'Force ' : 'Spare ' ) + names[n - 1];
    } else {
        getLady(n).title = (play == 0 ? 'Enjoy ' : 'Spare ' ) + names[n - 1];
    }
}

function checkBackground() {
    if (isPlaying(0) == 0) {
        get('bodyId').style.backgroundImage = "none";
    } else {
        get('bodyId').style.backgroundImage = "url('onair_bg" + magic + ".png')";
    }
}

function getPlayCount() {
    cnt = 0;
    for (i = 1; i <= t; i++) {
        cnt += isPlaying(i);
    }
    return cnt;
}

function checkVibrator() {
    cnt = getPlayCount();
    if (cnt == 1 && spread == 0) {
        spread = 1;
    }
    if (cnt == t - 1 && spread == 1) {
        spread = 0;
    }
    playing = isPlaying(0);
    if (background == 0 || (playing && cnt == 0)) {
        document.getElementById('ifr0').src = 'nothing.html';
    } else if (!playing && cnt > 0) {
        document.getElementById('ifr0').src = 'player.html?Loop';
    }
}

function switchMagic() {
    preload();
    magic = 1 - magic;
    get('meditation').src = (magic == 0 ? 'meditation_off.png' : 'meditation_on.png');
    for (n = 1; n <= t; n++) {
        if (isPlaying(n) == 1 || magic == 1) {
            get('ifr' + n).src = 'player.html?' + magic + n;
        }
        getLady(n).src = getLadyPrefix(n) + n + '.png';
        checkTitle(n);
    }
    checkVibrator();
    checkBackground();
    get('exchange').style.visibility = (magic == 1 ? 'hidden' : 'visible');
}

function switchSwap() {
    swap = 1 - swap;
    get('exchange').src = (swap == 0 ? 'swap_off.png' : 'swap_on.png');
}

function switchBg() {
    background = 1 - background;
    checkVibrator();
    get('vibration').src = (background == 0 ? 'bg_off.png' : 'bg_on.png');
}

function getLadyPrefix(n) {
    return '' + (magic + (isPlaying(n) ? 0 : 2));
}

function doMouseMove(n, event) {
    var lady = getLady(n);
    if (norm(new Vector(event.clientX - (lady.offsetLeft + size / 2), event.clientY - (lady.offsetTop + size / 2))) > size / 2) {
        lady.style.cursor = 'auto';
        lady.title = '';
    } else {
        lady.style.cursor = 'pointer';
        checkTitle(n);
    }

}

function doClick(n, event) {
    preload();
    var lady = getLady(n);
    if (event != null && norm(new Vector(event.clientX - (lady.offsetLeft + size / 2), event.clientY - (lady.offsetTop + size / 2))) > size / 2) return;
    play = isPlaying(n);
    get('ifr' + n).src = (play == 1 ? 'nothing.html' : 'player.html?' + magic + n);
    lady.src = getLadyPrefix(n) + n + '.png';
    checkTitle(n);
    checkVibrator();
    checkBackground();
}

//Math
function Vector(x, y) {
    this.x = x;
    this.y = y;
}

function norm(a) {
    return Math.sqrt(a.x * a.x + a.y * a.y);
}

function multiply(a, n) {
    return new Vector(a.x * n, a.y * n);
}

function normalizeN(a, n) {
    return multiply(normalize(a), n);
}

function normalize(a) {
    return multiply(a, 1 / norm(a));
}

function scalarProduct(a, b) {
    return a.x * b.x + a.y * b.y;
}

function add(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
}

function remove(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
}

function parallelProjection(a, b) {
    return multiply(normalize(b), scalarProduct(a, b) / norm(b));
}

function orthogonalProjection(a, b) {
    return remove(a, parallelProjection(a, b));
}

function cos(a, b) {
    return scalarProduct(a, b) / (norm(a) * norm(b));
}

function rotate(a, theta) {
    return new Vector(a.x * Math.cos(theta) - a.y * Math.sin(theta), a.x * Math.sin(theta) + a.y * Math.cos(theta));
}

//movement
function getMaxX() {
    return get('bodyId').clientWidth - size;
}
function getMaxY() {
    return get('bodyId').clientHeight - size;
}

function doMove() {
    theta = 2* Math.PI * (new Date().getTime()%15000)/15000;
    for (n = 1; n <= t; n++) {
        var p = pos[n - 1];
        var s = speed[n - 1];
        p.x += s.x;
        p.y += s.y;
        if (p.x < 0) {
            p.x = 0;
            s.x = -s.x;
        }
        if (p.y < 0) {
            p.y = 0;
            s.y = -s.y;
        }

        if (p.x > getMaxX()) {
            p.x = getMaxX();
            s.x = -s.x;
        }
        if (p.y > getMaxY()) {
            p.y = getMaxY();
            s.y = -s.y;
        }
        for (k = 1; k < t; k++) {
            if (k == n) continue;
            var sk = speed[k - 1];
            var direction = remove(pos[k - 1], pos[n - 1]);
            var normNow = norm(direction);
            var normNext = norm(remove(add(pos[k - 1], sk), add(pos[n - 1], s)));
            if ((normNow <= size) && (normNow > normNext)) {
                var toSaveN = orthogonalProjection(s, direction);
                var toInvertN = parallelProjection(s, direction);
                var toSaveK = orthogonalProjection(sk, direction);
                var toInvertK = parallelProjection(sk, direction);
                speed[k - 1] = add(toSaveK, toInvertN);
                speed[n - 1] = add(toSaveN, toInvertK);
                if (swap == 1 && magic == 0 && isPlaying(n) != isPlaying(k)) {
                    if (isPlaying(n) == 1) {
                        if (spread == 1) {
                            doClick(k, null);
                        }
                        else if (getPlayCount() == 1) {
                            doClick(k, null);
                            doClick(n, null);
                        }
                        else {
                            doClick(n, null);
                        }
                    } else {
                        if (spread == 1) {
                            doClick(n, null);
                        }
                        else if (getPlayCount() == 1) {
                            doClick(n, null);
                            doClick(k, null);
                        }
                        else {
                            doClick(k, null);
                        }
                    }
                }

            }
        }
        speed[n-1] = rotate(speed[n-1], norm(speed[n-1]) * Math.cos(theta)/200);
        getLady(n).style.left = p.x;
        getLady(n).style.top = p.y;
        if (norm(speed[n - 1]) > 20) speed[n - 1] = normalizeN(speed[n - 1], 20);
    }
}
