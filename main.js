// Variables
//const SPEED = 280
//const GRAV = 1200
//const JUMP_FORCE = 780
//const DBUG_INSP = false
//const PLAYER_SCALE = 0.58
var STARTING_SFX = 0
var REACHED_LEVEL2 = false
var SPEEN_ACTIVE = 0

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
        height: 320,
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
loadSprite("black", "assets/intro.png")
loadSprite("block", "assets/hitboxes/block.png")
loadSprite("water", "assets/hitboxes/water.png")
loadSprite("wood", "assets/hitboxes/wood.png")
loadSprite("background", "assets/screen1.png");
loadSprite("background2", "assets/screen2.png");
loadSound("jump", "sound/jump.wav")
loadSound("dash", "sound/dash.wav")
loadSound("ground", "sound/hitground.wav")

gravity(CONFIG.GRAVITY)

// Defines Levels (AKA: Scenes)
scene("title", ({ levelIdx }) => {
    // create a black bg that covers the entire screen
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

    wait(2.5, () => {
        destroy(bg)
        destroy(b)
        destroy(title)
    }).then(() => {
        const gameTitle = add([
            text("Mossed Up", {
                font: "sinko",
                fill: "white",
                align: "center",
            }),
            pos(width() / 2, height() / 2.7),
            area(),
            origin("bot"),
        ])
        gameTitle.scale = 13

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

        const splash = add([
            text(CONFIG.SPLASH_TEXTS[randi(0, CONFIG.SPLASH_TEXTS.length)], {
                font: "sinko",
                align: "center",
            }),
            pos(width() * 0.78, height() / 2.9),
            rotate(-20),
            color(245, 255, 46),
            origin("center"),
        ])
        splash.scale = 4
        
        startBtn.onClick(() => {
            go("screen1", {
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

scene("screen2", ({ levelIdx, playerposx }) => {
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
    
    playercontlv2(playerposx, 1400, levelIdx)
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

    debug.inspect = CONFIG.DEBUG
    player.scale = CONFIG.PLAYER_SCALE

    // Movement Bindings
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

    onKeyPress("v", () => {
        if (SPEEN_ACTIVE === 0) {
        } else if (!player.isGrounded()) {
            player.jump(CONFIG.JUMP_FORCE + 30)
            play("dash")
            SPEEN_ACTIVE = 0
        } else {
        }
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
        if (player.pos.y <= 100) {
            go("screen2", {
                levelIdx: levelIdx + 1,
                playerposx: player.pos.x,
                playerposy: player.pos.y,
            })
        }
    })
}

function playercontlv2(x, y, levelIdx) {
    const player = add([ 
        sprite("player", { anim: "idle" }),
        pos(x, y),
        area(),
		body(),
		origin("bot"),
    ])

    debug.inspect = CONFIG.DEBUG
    player.scale = CONFIG.PLAYER_SCALE

    player.onCollide("water", () => {
        SPEEN_ACTIVE = 1
    })

    player.onCollide("wood", () => {
        SPEEN_ACTIVE = 0
    })

    onLoad(() => {
        player.pos.x = x
        player.pos.y = 1370

        player.jump(CONFIG.JUMP_FORCE)
        player.play("jump")
    })

    // Movement Bindings
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

    onKeyPress("v", () => {
        if (SPEEN_ACTIVE === 0) {
        } else if (!player.isGrounded()) {
            player.jump(CONFIG.JUMP_FORCE + 30)
            play("dash")
            SPEEN_ACTIVE = 0
        } else {
        }
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
            go("screen1", {
                levelIdx: levelIdx,
                playerposx: player.pos.x,
                playerposy: player.pos.y,
            })
        }
    })
}