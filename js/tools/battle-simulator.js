/**
 * Battle Simulator - 戦闘シミュレーター
 * KingShot公式の戦闘メカニズムに基づいた実装
 */

class BattleSimulator {
  constructor() {
    this.troopTypes = ['infantry', 'cavalry', 'archery'];
    this.troopNames = {
      infantry: '歩兵',
      cavalry: '騎兵',
      archery: '弓兵'
    };
  }

  /**
   * ダメージ計算
   * Lethality（致命性）vs Defense（防御）
   */
  calculateDamage(attackerLethality, defenderDefense, defenderHealth) {
    // 防御による軽減（最大50%）
    const defenseReduction = Math.min(0.5, defenderDefense / 200);
    const actualDamage = attackerLethality * (1 - defenseReduction);
    
    // 1ユニットあたりのダメージ
    const damagePerUnit = Math.max(1, actualDamage);
    
    // 倒される兵数
    const troopsKilled = Math.floor(damagePerUnit / defenderHealth);
    
    return Math.max(0, troopsKilled);
  }

  /**
   * 兵種相性係数
   */
  getTroopBonusMultiplier(attackerType, defenderType) {
    const bonusMap = {
      'cavalry-infantry': 1.5,  // 騎兵は歩兵に強い
      'infantry-archery': 1.3,  // 歩兵は弓兵に強い
      'archery-cavalry': 1.2,   // 弓兵は騎兵に強い
    };
    
    const key = `${attackerType}-${defenderType}`;
    return bonusMap[key] || 1.0;
  }

  /**
   * 単一ラウンドの戦闘シミュレーション
   */
  simulateSingleBattle(playerStats, opponentStats) {
    let playerInfantry = playerStats.infantry.count;
    let playerCavalry = playerStats.cavalry.count;
    let playerArchery = playerStats.archery.count;
    
    let opponentInfantry = opponentStats.infantry.count;
    let opponentCavalry = opponentStats.cavalry.count;
    let opponentArchery = opponentStats.archery.count;
    
    let playerTotalDamage = 0;
    let opponentTotalDamage = 0;
    
    const maxRounds = 100;
    let round = 0;
    
    while (
      round < maxRounds &&
      (playerInfantry > 0 || playerCavalry > 0 || playerArchery > 0) &&
      (opponentInfantry > 0 || opponentCavalry > 0 || opponentArchery > 0)
    ) {
      round++;
      
      // プレイヤー側の攻撃
      if (opponentInfantry > 0) {
        // 敵歩兵を攻撃
        const infantryDamage = this.calculateDamage(
          playerStats.infantry.lethality * this.getTroopBonusMultiplier('infantry', 'infantry'),
          opponentStats.infantry.defense,
          opponentStats.infantry.health
        );
        opponentInfantry = Math.max(0, opponentInfantry - infantryDamage * playerInfantry / 100);
        playerTotalDamage += infantryDamage * playerInfantry / 100;
        
        const cavalryDamage = this.calculateDamage(
          playerStats.cavalry.lethality * this.getTroopBonusMultiplier('cavalry', 'infantry'),
          opponentStats.infantry.defense,
          opponentStats.infantry.health
        );
        opponentInfantry = Math.max(0, opponentInfantry - cavalryDamage * playerCavalry / 100);
        playerTotalDamage += cavalryDamage * playerCavalry / 100;
        
        const archeryDamage = this.calculateDamage(
          playerStats.archery.lethality * this.getTroopBonusMultiplier('archery', 'infantry'),
          opponentStats.infantry.defense,
          opponentStats.infantry.health
        );
        opponentInfantry = Math.max(0, opponentInfantry - archeryDamage * playerArchery / 100);
        playerTotalDamage += archeryDamage * playerArchery / 100;
      } else if (opponentCavalry > 0) {
        // 敵騎兵を攻撃
        const infantryDamage = this.calculateDamage(
          playerStats.infantry.lethality * this.getTroopBonusMultiplier('infantry', 'cavalry'),
          opponentStats.cavalry.defense,
          opponentStats.cavalry.health
        );
        opponentCavalry = Math.max(0, opponentCavalry - infantryDamage * playerInfantry / 100);
        playerTotalDamage += infantryDamage * playerInfantry / 100;
        
        const cavalryDamage = this.calculateDamage(
          playerStats.cavalry.lethality * this.getTroopBonusMultiplier('cavalry', 'cavalry'),
          opponentStats.cavalry.defense,
          opponentStats.cavalry.health
        );
        opponentCavalry = Math.max(0, opponentCavalry - cavalryDamage * playerCavalry / 100);
        playerTotalDamage += cavalryDamage * playerCavalry / 100;
        
        const archeryDamage = this.calculateDamage(
          playerStats.archery.lethality * this.getTroopBonusMultiplier('archery', 'cavalry'),
          opponentStats.cavalry.defense,
          opponentStats.cavalry.health
        );
        opponentCavalry = Math.max(0, opponentCavalry - archeryDamage * playerArchery / 100);
        playerTotalDamage += archeryDamage * playerArchery / 100;
      } else if (opponentArchery > 0) {
        // 敵弓兵を攻撃
        const infantryDamage = this.calculateDamage(
          playerStats.infantry.lethality * this.getTroopBonusMultiplier('infantry', 'archery'),
          opponentStats.archery.defense,
          opponentStats.archery.health
        );
        opponentArchery = Math.max(0, opponentArchery - infantryDamage * playerInfantry / 100);
        playerTotalDamage += infantryDamage * playerInfantry / 100;
        
        const cavalryDamage = this.calculateDamage(
          playerStats.cavalry.lethality * this.getTroopBonusMultiplier('cavalry', 'archery'),
          opponentStats.archery.defense,
          opponentStats.archery.health
        );
        opponentArchery = Math.max(0, opponentArchery - cavalryDamage * playerCavalry / 100);
        playerTotalDamage += cavalryDamage * playerCavalry / 100;
        
        const archeryDamage = this.calculateDamage(
          playerStats.archery.lethality * this.getTroopBonusMultiplier('archery', 'archery'),
          opponentStats.archery.defense,
          opponentStats.archery.health
        );
        opponentArchery = Math.max(0, opponentArchery - archeryDamage * playerArchery / 100);
        playerTotalDamage += archeryDamage * playerArchery / 100;
      }
      
      // 相手側の攻撃
      if (playerInfantry > 0) {
        const infantryDamage = this.calculateDamage(
          opponentStats.infantry.lethality * this.getTroopBonusMultiplier('infantry', 'infantry'),
          playerStats.infantry.defense,
          playerStats.infantry.health
        );
        playerInfantry = Math.max(0, playerInfantry - infantryDamage * opponentInfantry / 100);
        opponentTotalDamage += infantryDamage * opponentInfantry / 100;
        
        const cavalryDamage = this.calculateDamage(
          opponentStats.cavalry.lethality * this.getTroopBonusMultiplier('cavalry', 'infantry'),
          playerStats.infantry.defense,
          playerStats.infantry.health
        );
        playerInfantry = Math.max(0, playerInfantry - cavalryDamage * opponentCavalry / 100);
        opponentTotalDamage += cavalryDamage * opponentCavalry / 100;
        
        const archeryDamage = this.calculateDamage(
          opponentStats.archery.lethality * this.getTroopBonusMultiplier('archery', 'infantry'),
          playerStats.infantry.defense,
          playerStats.infantry.health
        );
        playerInfantry = Math.max(0, playerInfantry - archeryDamage * opponentArchery / 100);
        opponentTotalDamage += archeryDamage * opponentArchery / 100;
      } else if (playerCavalry > 0) {
        const infantryDamage = this.calculateDamage(
          opponentStats.infantry.lethality * this.getTroopBonusMultiplier('infantry', 'cavalry'),
          playerStats.cavalry.defense,
          playerStats.cavalry.health
        );
        playerCavalry = Math.max(0, playerCavalry - infantryDamage * opponentInfantry / 100);
        opponentTotalDamage += infantryDamage * opponentInfantry / 100;
        
        const cavalryDamage = this.calculateDamage(
          opponentStats.cavalry.lethality * this.getTroopBonusMultiplier('cavalry', 'cavalry'),
          playerStats.cavalry.defense,
          playerStats.cavalry.health
        );
        playerCavalry = Math.max(0, playerCavalry - cavalryDamage * opponentCavalry / 100);
        opponentTotalDamage += cavalryDamage * opponentCavalry / 100;
        
        const archeryDamage = this.calculateDamage(
          opponentStats.archery.lethality * this.getTroopBonusMultiplier('archery', 'cavalry'),
          playerStats.cavalry.defense,
          playerStats.cavalry.health
        );
        playerCavalry = Math.max(0, playerCavalry - archeryDamage * opponentArchery / 100);
        opponentTotalDamage += archeryDamage * opponentArchery / 100;
      } else if (playerArchery > 0) {
        const infantryDamage = this.calculateDamage(
          opponentStats.infantry.lethality * this.getTroopBonusMultiplier('infantry', 'archery'),
          playerStats.archery.defense,
          playerStats.archery.health
        );
        playerArchery = Math.max(0, playerArchery - infantryDamage * opponentInfantry / 100);
        opponentTotalDamage += infantryDamage * opponentInfantry / 100;
        
        const cavalryDamage = this.calculateDamage(
          opponentStats.cavalry.lethality * this.getTroopBonusMultiplier('cavalry', 'archery'),
          playerStats.archery.defense,
          playerStats.archery.health
        );
        playerArchery = Math.max(0, playerArchery - cavalryDamage * opponentCavalry / 100);
        opponentTotalDamage += cavalryDamage * opponentCavalry / 100;
        
        const archeryDamage = this.calculateDamage(
          opponentStats.archery.lethality * this.getTroopBonusMultiplier('archery', 'archery'),
          playerStats.archery.defense,
          playerStats.archery.health
        );
        playerArchery = Math.max(0, playerArchery - archeryDamage * opponentArchery / 100);
        opponentTotalDamage += archeryDamage * opponentArchery / 100;
      }
    }
    
    const playerAlive = playerInfantry > 0 || playerCavalry > 0 || playerArchery > 0;
    const opponentAlive = opponentInfantry > 0 || opponentCavalry > 0 || opponentArchery > 0;
    
    return {
      playerWon: playerAlive && !opponentAlive,
      playerDamage: playerTotalDamage,
      opponentDamage: opponentTotalDamage,
    };
  }

  /**
   * 複数回のシミュレーション実行
   */
  simulateBattle(playerStats, opponentStats, numberOfBattles = 1000) {
    let playerWins = 0;
    let totalPlayerDamage = 0;
    let totalInfantryDamage = 0;
    let totalCavalryDamage = 0;
    let totalArcheryDamage = 0;
    
    for (let i = 0; i < numberOfBattles; i++) {
      const result = this.simulateSingleBattle(playerStats, opponentStats);
      
      if (result.playerWon) {
        playerWins++;
      }
      
      totalPlayerDamage += result.playerDamage;
      
      // ダメージの兵種別割合（簡略化版）
      const damageRatio = result.playerDamage > 0 ? 1 : 0;
      totalInfantryDamage += damageRatio * 0.3;
      totalCavalryDamage += damageRatio * 0.2;
      totalArcheryDamage += damageRatio * 0.5;
    }
    
    const winRate = (playerWins / numberOfBattles) * 100;
    const expectedDamage = totalPlayerDamage / numberOfBattles;
    const totalDamage = totalInfantryDamage + totalCavalryDamage + totalArcheryDamage;
    
    return {
      winRate,
      expectedDamage,
      infantryDamagePercentage: totalDamage > 0 ? (totalInfantryDamage / totalDamage) * 100 : 0,
      cavalryDamagePercentage: totalDamage > 0 ? (totalCavalryDamage / totalDamage) * 100 : 0,
      archeryDamagePercentage: totalDamage > 0 ? (totalArcheryDamage / totalDamage) * 100 : 0,
    };
  }
}

// グローバルインスタンス
const battleSimulator = new BattleSimulator();
