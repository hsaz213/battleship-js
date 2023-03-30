/*
    function: aiCurrentHits(), süllyedt=destroyPlayerShip()
    globális... számláló a körbelövéshez, kiindulási mező a 2. 3. részhez, irány a 3. részhez

    ha aiCurrentHits===0, akkor firstAiShoot(isOver)
      ha süllyedt (itt: mező===1) destroyPlayerShip() vagy mező=x simán
      ha nem süllyedt, de talált: mező[i][j]=[i][j]
      return

    ha aiCurrentHits===1: secondAiShoot(isOver,számláló,mező[i][j])

      (ha nem: óramutató szerint pl. lőjön körbe körök alatt:
      adott mező nem létezik: ugorjon a következőre még ezen a körön belül, ameddig létezőre nem jut (mert "láthatja" a táblát),
      amikor létezőre jutott: lőjön oda):
        ha nem talált: számláló ++, return

        ha talált: számláló 0, irány megjegyez, return
          (itt egy destroyPlayerShip-pel idáig már csak 1-2-es hajós mapon letesztelhető)

    ha aiCurrentHits>1: thirdAiShoot(isOver,mező[i][j].irány)
      ha adott irányban (kiindulási mező + aiCurrentHits). mező létezik és nem üres vagy miss:
        oda lő és ha irány+1 ekkor létezik és üres vagy miss és kiindulási mező -irány - 1 nem létezik vagy üres vagy miss:
        destroyPlayerShip()
        return

      ha nem létezik (kiindulási mező + aiCurrentHits). mező és/vagy kiindulási mező -irány - 1 nem üres vagy miss:
        kiindulási mező -irány-ba lőjön addig, ameddig -irány -1 nem lenne üres vagy miss:
        destroyPlayerShip()
        return
  */
