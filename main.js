// Variables
var STARTING_SFX = 0
var LOADING_SEEN = false
var SPEEN_ACTIVE = 0
var MUSIC_PLAYING = false
var LV3 = 0
var LV2 = 0

var DONUT_COUNT = 0
var DONUT_LV1 = 0
var DONUT_LV2 = 0
var DONUT_LV3 = 0

// Import kaboom
import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs"
import CONFIG from "./config.js"
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize Context (Kaboom is based on canvas)
kaboom({
    width: 1440,
    height: 1440,
    scale: 0.5,
    clearColor: [0, 0, 0],
})

// Loads assets and sounds
loadSpriteAtlas("assets/player.png", {
    "player": {
        x: 0,
        y: 0,
        width: 2875,
        height: 360,
        sliceX: 16,
        anims: {
            idle: {
                from: 0, 
                to: 4, 
                loop: true, 
                speed: 7
            },
            jump: {
                from: 5,
                to: 7,
                speed: 10
            },
            swim: {
                from: 8,
                to: 15,
                loop: true
            }
        },
    }
})
loadSpriteAtlas("assets/bee.png", {
    "b": {
        x: 0,
        y: 0,
        width: 1280,
        height: 230,
        sliceX: 4,
        anims: {
            idle: {
                from: 0,
                to: 3,
                loop: true,
                speed: 10
            }
        }
    }
})
loadSpriteAtlas("assets/donut-s.png", {
    "donut": {
        x: 0,
        y: 0,
        width: 1320,
        height: 125,
        sliceX: 12,
        anims: {
            idle: {
                from: 0,
                to: 11,
                loop: true,
                speed: 15,
            }
        }
    }
})
loadSprite("black", "assets/intro.png")
loadSprite("credits", "assets/credits.png")
loadSprite("block", "assets/hitboxes/block.png")
loadSprite("water", "assets/hitboxes/water.png")
loadSprite("wood", "assets/hitboxes/wood.png")
loadSprite("background", "assets/screen1.png");
loadSprite("background2", "assets/screen2.png");
loadSprite("background3", "assets/screen3.png");
loadSprite("background4", "assets/screen4EB.png");
loadSprite("backgroundBlurred", "assets/screen1Blur.png");
loadSprite("gameTitle", "assets/mosseduplogo.png")

// Sounds
loadSound("collect", "sound/collect.wav")
loadSound("jump", "sound/jump.wav")
loadSound("dash", "sound/dash.wav")
loadSound("beehit", "sound/beeHit.wav")
loadSound("playerhit", "sound/playerHit.wav")
loadSound("ground", "sound/hitground.wav")
loadSound("bee", "sound/bee.wav")
loadSound("peaceandwarmth", "sound/peaceandwarmth.wav")

gravity(CONFIG.GRAVITY)

// Defines Levels (AKA: Scenes)
scene("title", ({ levelIdx }) => {
    if (LOADING_SEEN === false) {
        loadScreen()
    } else {
        titleSeq()
    }
})

scene("credits", () => {
    const bg = add([
        sprite("backgroundBlurred"),
        pos(width() / 2, height()),
        area(),
        origin("bot"),
    ])

    const credits = add([
        sprite("credits"),
        pos(width() / 2, height() / 2),
        area(),
        origin("center"),
    ])

    const backBtn = add([
        text("Back", {
            font: "sinko",
        }),
        pos(width() / 2, height() / 1.25),
        area({ 
            scale: 5.5,
        }),
        origin("center"),
    ]) 

    backBtn.scale = 6
    credits.scale = 1.7

    backBtn.onUpdate(() => {
        if (backBtn.isHovering()) {
            const t = time() * 10
            backBtn.color = rgb(9, 189, 21)
            backBtn.scale = vec2(6)
        } else {
            backBtn.scale = vec2(5)
            backBtn.color = rgb()
        }
    })

    backBtn.onClick(() => {
        go("title", {
            levelIdx: 0,
        })
    })
})

scene("screen1", ({ levelIdx, playerposx }) => {
    const level = addLevel([
        '=                                              =',    
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                 == = =                       =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                          = ==                =',    
        '                                                ',
        '=                                              =',
        '                                                ',
        '=               = = = =                        =',
        '                =                               ',
        '=                 = = =                        =',
        '                                                ',
        '=                                  ===         =',
        '                                                ', 
        '=   =======                                    =',
        '                                                ',
        '=                                              =',
        '                      == = =                    ',
        '=                               = == = = = = = =',
        '                                =               ',
        '=                               =               ',
        '                                =               ',
        '  = = = = = = ==                =               ',
        '               =                =               ',
        '                                =               ',
        '             ^ =                =               ',
        '               ==================               ',
        '                                                ',
        '                                                ',
        '                                                ',
        '                                                ',
    ], {
        width: 32,
        height: 32,
        pos: vec2(-27, 31),
        "^": () => [
            sprite("background", { width: width(), height: height() }),
            pos(294, -367),
            origin("center"),
            scale(1),
            fixed(),
            "background",
        ],
        "@": () => [
            sprite("player", { anim: "idle" }),
            area(),
            body(),
            origin("bot"),
            "player",
        ],
        "=": () => [
            sprite("block"),
            area(),
            solid(),
            origin("center"),
        ]
    })
    
    gravity(CONFIG.GRAV)

    const background = add([
        sprite("background", { width: width(), height: height() }),
        pos(width() / 2, height() / 2),
        origin("center"),
        scale(1),
        fixed(),
    ])

    if (levelIdx == 0) {
        playercontlv1(578, 959, levelIdx)
    } else if (levelIdx > 0) {
        playercontlv1(playerposx, 110, levelIdx)
    }
})

scene("screen2", ({ levelIdx, playerposx, playerposy, lv }) => {
    const level = addLevel([
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                        # # # #                 ',
        '=                       = = = =                =',
        '                        = = = =                 ',
        '=                       = = = =       #######  =',
        '                                      =======   ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',    
        '                                        ----    ',
        '=           -- - --                     = ==   =',
        '            == = ==                             ',
        '=            =                                 =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                       ##                     =',
        '                    # # ==                      ', 
        '=                   = =                        =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '     ##                                         ',
        '=    ==                   -----                =',
        '     ==                  == = =                 ',
        '=                        =    =                =',
        '                                                ',
        '=                        =    =                =',
        '                         =                      ',
        '=                        = = =                 =',
        '             ^                                  ',
        '=                                              =',
    ], {
        width: 32,
        height: 32,
        pos: vec2(-30, 31),
        "^": () => [
            sprite("background2", { width: width(), height: height() }),
            pos(334, -623),
            origin("center"),
            scale(1),
            fixed(),
            "background",
        ],
        "=": () => [
            sprite("block"),
            area(),
            solid(),
            origin("center"),
        ],
        "-": () => [
            sprite("water"),
            area({ scale: 2 }),
            origin("center"),
            "water"
        ],
        "#": () => [
            sprite("wood"),
            area({ scale: 1 }),
            origin("center"),
            "wood"
        ]
    })

    gravity(CONFIG.GRAV)
    const water = get("water")[0]
    const wood = get("wood")[0]
    
    playercontlv2(playerposx, playerposy, levelIdx, lv)
})

scene("screen3", ({ levelIdx, playerposx, playerposy, lv }) => {
    const level = addLevel([
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '   # # #                      - -               ',
        '=  = = =                  -- -= =              =',    
        '                          = = = =               ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                # # #                           ', 
        '=               = = =                          =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                       ---                    =',
        '                        ===                     ',
        '=                                              =',
        '             ^                                  ',
        '=                                              =',
    ], {
        width: 32,
        height: 32,
        pos: vec2(-30, 31),
        "^": () => [
            sprite("background3", { width: width(), height: height() }),
            pos(334, -655),
            origin("center"),
            scale(1),
            fixed(),
            "background",
        ],
        "=": () => [
            sprite("block"),
            area(),
            solid(),
            origin("center"),
        ],
        "-": () => [
            sprite("water"),
            area({ scale: 2 }),
            origin("center"),
            "water"
        ],
        "#": () => [
            sprite("wood"),
            area({ scale: 1 }),
            origin("center"),
            "wood"
        ],
    })

    debug.inspect = CONFIG.DEBUG
    gravity(CONFIG.GRAVITY)
    playercontlv3(playerposx, playerposy, levelIdx, lv)
})

scene("screen4", ({ levelIdx, playerposx, playerposy, lv }) => {
    const level = addLevel([
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                           ## # #             =',
        '                            == = =              ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=         -- - -                               =',
        '          == = =                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',    
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                              ## #              ',
        '=                             == =             =',
        '                                                ',
        '=                                              =',
        '                                                ', 
        '=                                              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '      # ##                                      ',
        '=     = ==                                     =',
        '                                                ',
        '=                                              =',
        '                         -- - - -               ',
        '=                        == = = =              =',
        '                                                ',
        '=                                              =',
        '                                                ',
        '=                                              =',
        '             ^                                  ',
        '=                                              =',
    ], {
        width: 32,
        height: 32,
        pos: vec2(-30, 31),
        "^": () => [
            sprite("background4", { width: width(), height: height() }),
            pos(334, -655),
            origin("center"),
            scale(1),
            fixed(),
            "background",
        ],
        "=": () => [
            sprite("block"),
            area(),
            solid(),
            origin("center"),
        ],
        "-": () => [
            sprite("water"),
            area({ scale: 2 }),
            origin("center"),
            "water"
        ],
        "#": () => [
            sprite("wood"),
            area({ scale: 1 }),
            origin("center"),
            "wood"
        ],
    })

    debug.inspect = CONFIG.DEBUG
    gravity(CONFIG.GRAVITY)
    playercontlv4(playerposx, playerposy, levelIdx, lv)
})

go("title", {
    levelIdx: 0,
})

function playercontlv1(x, y, levelIdx) {
    const player = add([ 
        sprite("player", { anim: "idle" }),
        pos(x, y),
        area(),
        body(),
        origin("bot"),
    ])

    const donut = add([
        sprite("donut", { anim: "idle" }),
        pos(1125, 470),
        area(),
        origin("center"),
    ])

    if (DONUT_LV1 === 1) {
        donut.destroy()
    }

    debug.inspect = CONFIG.DEBUG
    player.scale = CONFIG.PLAYER_SCALE

    // Movement Bindings
    movementCont(player)
    
    onKeyPress("v", () => {
        if (SPEEN_ACTIVE === 0) {
        } else if (!player.isGrounded()) {
            player.jump(CONFIG.JUMP_FORCE - 50)
            play("dash")
            SPEEN_ACTIVE = 0
        } else {
        }
    })

    onKeyPress("escape", () => {
        go("title", {
            levelIdx: levelIdx - levelIdx,
        })
    })

    player.onGround(() => {
        player.play("idle")
        if (STARTING_SFX === 0) {
            STARTING_SFX = 1
        } else {
            play("ground")
        }
    })

    player.onUpdate(() => {
        if (player.isTouching(donut)) {
            DONUT_COUNT + 1
            DONUT_LV1 = 1
            donut.destroy()
            play("collect")
        } else if (player.pos.y <= 100) {
            go("screen2", {
                levelIdx: levelIdx + 1,
                playerposx: player.pos.x,
                playerposy: 1350,
            })
        }
    })
}

function playercontlv2(x, y, levelIdx, lv) {
    const player = add([ 
        sprite("player", { anim: "idle" }),
        pos(x, y),
        area(),
		body(),
		origin("bot"),
    ])

    const donut = add([
        sprite("donut"),
        pos(155, 1050),
        area(),
        origin("center"),
    ])

    if (DONUT_LV2 === 1) {
        donut.destroy()
    }

    debug.inspect = CONFIG.DEBUG
    player.scale = CONFIG.PLAYER_SCALE
    donut.play("idle")

    onLoad(() => {
        player.pos.x = x
        player.pos.y = y

        if (lv === 3) {
        } else {
            player.jump(CONFIG.JUMP_FORCE)
            player.play("jump")
        }
    })

    movementCont(player)

    onKeyPress("v", () => {
        if (SPEEN_ACTIVE === 0) {
        } else if (!player.isGrounded()) {
            player.jump(CONFIG.JUMP_FORCE - 50)
            play("dash")
            SPEEN_ACTIVE = 0
        } else {
        }
    })

    onKeyPress("escape", () => {
        go("title", {
            levelIdx: levelIdx - levelIdx,
        })
    })

    player.onGround(() => {
        if (SPEEN_ACTIVE <= 0) {
            player.play("idle")
        } else {
            player.play("swim")
        }
        play("ground")
    })

    player.onUpdate(() => {
        if (player.isTouching(donut)) {
            DONUT_COUNT + 1
            DONUT_LV2 = 1
            donut.destroy()
            play("collect")
        } else if (player.pos.y >= 1500) {
            go("screen1", {
                levelIdx: levelIdx,
                playerposx: player.pos.x,
                playerposy: player.pos.y,
            })
        } else if (player.pos.y <= 80) {
            go("screen3", {
                levelIdx: levelIdx + 1,
                playerposx: player.pos.x,
                playerposy: 1400,
                lv: 3
            })
        }
    })
}

function playercontlv3(x, y, levelIdx, lv) {
    const player = add([ 
        sprite("player", { anim: "idle" }),
        pos(x, y),
        area(),
		body(),
		origin("bot"),
    ])

    const bee = add([
        sprite("b"),
        pos(514, 383),
        area(),
        solid(),
        origin("bot"),
    ])

    const donut = add([
        sprite("donut", { anim: "idle" }),
        pos(1330, 340),
        area(),
        origin("center"),
    ])

    if (DONUT_LV3 === 1) {
        donut.destroy()
    }

    debug.inspect = CONFIG.DEBUG
    player.scale = CONFIG.PLAYER_SCALE
    bee.scale = CONFIG.PLAYER_SCALE + 0.1

    onLoad(() => {
        player.pos.x = x
        player.pos.y = y

        if (lv === 4) {
        } else {
            player.jump(CONFIG.JUMP_FORCE)
            player.play("jump")
            bee.play("idle")
        }
    })

    movementCont(player)

    onKeyPress("v", () => {
        if (SPEEN_ACTIVE === 0) {
        } else if (!player.isGrounded()) {
            if (player.isTouching(donut)) {
                DONUT_COUNT + 1
                DONUT_LV3 = 1
                donut.destroy()
                play("collect")
            } else if (player.isTouching(bee)) {
                bee.destroy()
                wait(0.5)
                player.jump(CONFIG.JUMP_FORCE + 150)
                play("beehit")
            } else {
                player.jump(CONFIG.JUMP_FORCE - 50)
                play("dash")
                SPEEN_ACTIVE = 0
            }
        } else {
        }
    })

    onKeyPress("escape", () => {
        go("title", {
            levelIdx: levelIdx - levelIdx,
        })
    })

    player.onGround(() => {
        if (SPEEN_ACTIVE <= 0) {
            player.play("idle")
        } else {
            player.play("swim")
        }
        play("ground")
    })

    player.onUpdate(() => {
        if (player.isTouching(donut)) {
            DONUT_COUNT + 1
            DONUT_LV2 = 1
            donut.destroy()
            play("collect")
        } else if (player.pos.y >= 1500) {
            go("screen2", {
                levelIdx: levelIdx,
                playerposx: player.pos.x,
                playerposy: 110,
                lv: 3
            })
        } else if (player.pos.y <= 80) {
            go("screen4", {
                levelIdx: levelIdx,
                playerposx: player.pos.x,
                playerposy: 1400,
                lv: 3
            })
        }
    })
}

function playercontlv4(x, y, levelIdx, lv) {
    const player = add([ 
        sprite("player", { anim: "idle" }),
        pos(x, y),
        area(),
		body(),
		origin("bot"),
    ])

    const bee = add([
        sprite("b"),
        pos(610, 800),
        area(),
        solid(),
        origin("bot"),
    ])

    bee.play("idle")

    debug.inspect = CONFIG.DEBUG
    player.scale = CONFIG.PLAYER_SCALE
    bee.scale = CONFIG.PLAYER_SCALE + 0.1

    onLoad(() => {
        player.pos.x = x
        player.pos.y = 1400

        if (lv === 5) {
        } else {
            player.jump(CONFIG.JUMP_FORCE)
            player.play("jump")
            bee.play("idle")
        }
    })

    movementCont(player)

    onKeyPress("v", () => {
        if (SPEEN_ACTIVE === 0) {
        } else if (!player.isGrounded()) {
            if (player.isTouching(bee)) {
                bee.destroy()
                wait(0.5)
                player.jump(CONFIG.JUMP_FORCE + 150)
                play("beehit")
            } else {
                player.jump(CONFIG.JUMP_FORCE - 50)
                play("dash")
                SPEEN_ACTIVE = 0
            }
        } else {
        }
    })

    onKeyPress("escape", () => {
        go("title", {
            levelIdx: levelIdx - levelIdx,
        })
    })

    player.onGround(() => {
        if (SPEEN_ACTIVE <= 0) {
            player.play("idle")
        } else {
            player.play("swim")
        }
        play("ground")
    })

    player.onUpdate(() => {
        if (player.pos.y >= 1500) {
            go("screen3", {
                levelIdx: levelIdx,
                playerposx: player.pos.x,
                playerposy: 110,
                lv: 4
            })
        }
    })
}

// ============================================================

function titleSeq() {
    const bg = add([
        sprite("backgroundBlurred"),
        pos(width() / 2, height()),
        area(),
        origin("bot"),
    ])

    const gameTitle = add([
        sprite("gameTitle"),
        pos(width() / 2, height() / 2.7),
        area(),
        origin("bot"),
    ])

    const startBtn = add([
        text('Start', { 
            font: "sinko",
            fill: "white",
            align: "center",
        }),
        pos(720, 720),
        area({ 
            cursor: "pointer",
            scale: "5.5"
        }),
        origin("center"),
    ])
        
    const aboutBtn = add([
        text('Credits', { 
            font: "sinko",
            fill: "white",
            align: "center",
        }),
        pos(720, 800),
        area({ 
            cursor: "pointer",
            scale: "5.5",
        }),
        origin("center"),
    ])

    const splash = add([
        text(CONFIG.SPLASH_TEXTS[randi(0, CONFIG.SPLASH_TEXTS.length)], {
            font: "sinko",
            align: "center",
        }),
        pos(width() * 0.78, height() / 2.9),
        rotate(-10),
        color(245, 255, 46),
        origin("center"),
    ])

    splash.scale = 4
    gameTitle.scale = 0.9
    startBtn.scale = 5.5
    aboutBtn.scale = 5.5

    const paw = play("peaceandwarmth", {
        loop: true,
        volume: 0.3,
    }) 
    paw.pause()

    if (MUSIC_PLAYING === true){
    } else {
        paw.play()
        MUSIC_PLAYING = true
    }
        
    startBtn.onClick(() => {
        paw.stop()
        go("screen1", {
            levelIdx: 0,
            playerposx: 0,
            playerposy: 0,
        })
    })

    aboutBtn.onClick(() => {
        go("credits", {
            levelIdx: 0,
            playerposx: 0,
            playerposy: 0,
        })
    })

    startBtn.onUpdate(() => {
        if (startBtn.isHovering()) {
            const t = time() * 10
            startBtn.color = rgb(9, 189, 21)
            startBtn.scale = vec2(6)
        } else {
            startBtn.scale = vec2(5)
            startBtn.color = rgb()
        }
    })

    aboutBtn.onUpdate(() => {
        if (aboutBtn.isHovering()) {
            const t = time() * 10
            aboutBtn.color = rgb(9, 189, 21)
            aboutBtn.scale = vec2(6)
        } else {
            aboutBtn.scale = vec2(5)
            aboutBtn.color = rgb()
        }
    })
}

function loadScreen() {
    const bg = add([
        sprite("black"),
        pos(width() / 2, height()),
        area(),
        color(0, 0, 0),
        origin("bot"),        
    ])

    const title = add([
        text("Team B Presents", {
            font: "sinko",
            fill: "white",
            align: "center",
        }),
        pos(width() / 2, height() / 2.7),
        area(),
        origin("bot"),      
    ])
    title.scale = 6

    const b = add([
        sprite("b"),
        pos(width() / 2, height() / 1.7),
        area(),
        origin("bot"),
    ])
    b.play('idle')

    wait(1, () => {
        play("bee", {
            volume: 0.5,
        })
    })

    wait(3.5, () => {
        stop("bee")
        destroy(bg)
        destroy(b)
        destroy(title)
    }).then(() => {
        LOADING_SEEN = true
        titleSeq()
    }) 
}

function movementCont(player) {
    player.onCollide("water", () => {
        SPEEN_ACTIVE = 1
    })

    player.onCollide("wood", () => {
        SPEEN_ACTIVE = 0
    })

    onKeyDown("left", () => {
        player.move(-CONFIG.SPEED, 0)
    })

    onKeyDown("right", () => {
        player.move(CONFIG.SPEED, 0)
    }) 

    onKeyDown("space", () => {
        if (player.isGrounded()) {
            player.jump(CONFIG.JUMP_FORCE)
            player.play("jump")
            play("jump")
        }
    })
}