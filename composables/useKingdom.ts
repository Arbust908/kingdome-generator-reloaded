import { ref, computed } from 'vue'
import type { Kingdom, KingdomGeneratorConfig, GenerationEvent, Noble, NobleHouse, Monument, War, OtherKingdom, Race, Attributes, SpecialFeature } from '~/types/kingdom'

export const useKingdom = () => {
  const kingdom = ref<Kingdom | null>(null)
  const events = ref<GenerationEvent[]>([])
  const isGenerating = ref(false)
  const currentYear = computed(() => kingdom.value?.year || 0)

  const races: Race[] = [
    { name: 'Elf', minLifespan: 900, maxLifespan: 1200, maturityAge: 100 },
    { name: 'Dwarf', minLifespan: 250, maxLifespan: 300, maturityAge: 50 },
    { name: 'Human', minLifespan: 60, maxLifespan: 90, maturityAge: 18 },
    { name: 'Orc', minLifespan: 35, maxLifespan: 45, maturityAge: 12 }
  ]

  const namesByRace = {
    Human: {
      male: ['Aldrich', 'Baldwin', 'Conrad', 'Dominic', 'Edmund', 'Frederick', 'Geoffrey', 'Harold', 'Magnus', 'Roland'],
      female: ['Adelaide', 'Beatrice', 'Catherine', 'Eleanor', 'Guinevere', 'Isabella', 'Margaret', 'Rosalind', 'Victoria']
    },
    Elf: {
      male: ['Aegnor', 'Celeborn', 'Ecthelion', 'Finrod', 'Glorfindel', 'Legolas', 'Thranduil', 'Elrond', 'Feanor', 'Fingolfin'],
      female: ['Arwen', 'Galadriel', 'Celebrian', 'Luthien', 'Idril', 'Aredhel', 'Finduilas', 'Nimrodel', 'Varda']
    },
    Dwarf: {
      male: ['Thorin', 'Balin', 'Dwalin', 'Gloin', 'Gimli', 'Durin', 'Thrain', 'Dain', 'Bombur', 'Bifur'],
      female: ['Dis', 'Kili', 'Fili', 'Thorina', 'Daina', 'Naina', 'Groin', 'Mora', 'Hilda']
    },
    Orc: {
      male: ['Grok', 'Thrak', 'Muzgash', 'Bolg', 'Azog', 'Grishnak', 'Ugluk', 'Lurtz', 'Shagrat', 'Gothmog'],
      female: ['Grisha', 'Mogka', 'Azka', 'Urgha', 'Sharog', 'Durka', 'Yagak', 'Gorka', 'Urka']
    }
  }

  const specialFeatures: SpecialFeature[] = [
    { name: 'Natural Leader', description: 'Born to lead others', powerBonus: 3 },
    { name: 'Strategic Mind', description: 'Exceptional at planning', powerBonus: 2 },
    { name: 'Charismatic', description: 'Natural charm and influence', powerBonus: 2 },
    { name: 'Warrior Blood', description: 'Natural combat prowess', powerBonus: 2 },
    { name: 'Diplomatic', description: 'Skilled negotiator', powerBonus: 2 },
    { name: 'Magical Affinity', description: 'Natural connection to magic', powerBonus: 3 },
    { name: 'Noble Blood', description: 'Pure noble lineage', powerBonus: 1 },
    { name: 'Tactical Genius', description: 'Master of warfare', powerBonus: 3 },
    { name: 'Scholar', description: 'Deep knowledge and wisdom', powerBonus: 2 },
    { name: 'Popular', description: 'Beloved by the people', powerBonus: 2 }
  ]

  const config = ref<KingdomGeneratorConfig>({
    yearsToSimulate: 100,
    nobleHouseNames: ['Alphus', 'Betan', 'Gammris', 'Celos', 'Kaeivar', 'Nautus'],
    otherKingdoms: ['Austaria', 'Griggledorn', 'Carthal', 'Tortestra'],
    maleNames: [], // Not used anymore, using namesByRace instead
    femaleNames: [], // Not used anymore, using namesByRace instead
    allowUsurping: true,
    inlineMonuments: true,
    inlineWars: true,
    inlineDeaths: true,
    inlineAscensions: true,
    inlinePower: true,
    nobleReviewPeriod: 10
  })

  const sobriquets = [
    'Bold', 'Pious', 'Terrible', 'Wise', 'Clever', 'Builder', 'Sage', 'Warlord',
    'Valiant', 'Merciless', 'Cruel', 'Good', 'Bad', 'Bald', 'Logician', 'Farmer',
    'Mirthful', 'Restless', 'Pillager', 'Butcher', 'Dragon', 'Poet', 'Reformer', 'Philosopher'
  ]

  const monumentTypes = [
    'Castle', 'Citadel', 'Tower', 'Shrine', 'Fortress', 'Monument', 'Wall',
    'Statue', 'Arch', 'Temple', 'Lighthouse', 'Colossus', 'Gardens', 'Library',
    'Palace', 'College', 'Observatory'
  ]

  const randomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)]
  }

  const rollAttribute = (): number => {
    return Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 3
  }

  const generateAttributes = (parent: Noble | null): Attributes => {
    if (!parent) {
      return {
        strength: rollAttribute(),
        dexterity: rollAttribute(),
        constitution: rollAttribute(),
        intelligence: rollAttribute(),
        wisdom: rollAttribute(),
        charisma: rollAttribute()
      }
    }

    // Inherit attributes from parent with some variation
    return {
      strength: Math.max(3, Math.min(18, parent.attributes.strength + (Math.random() * 4 - 2))),
      dexterity: Math.max(3, Math.min(18, parent.attributes.dexterity + (Math.random() * 4 - 2))),
      constitution: Math.max(3, Math.min(18, parent.attributes.constitution + (Math.random() * 4 - 2))),
      intelligence: Math.max(3, Math.min(18, parent.attributes.intelligence + (Math.random() * 4 - 2))),
      wisdom: Math.max(3, Math.min(18, parent.attributes.wisdom + (Math.random() * 4 - 2))),
      charisma: Math.max(3, Math.min(18, parent.attributes.charisma + (Math.random() * 4 - 2)))
    }
  }

  const evolveAttributes = (noble: Noble) => {
    const ageRatio = noble.age / noble.race.maxLifespan
    const physicalPeak = noble.race.maturityAge + (noble.race.maxLifespan - noble.race.maturityAge) * 0.2
    const mentalPeak = noble.race.maturityAge + (noble.race.maxLifespan - noble.race.maturityAge) * 0.6
    
    // Physical attributes decline after peak
    if (noble.age > physicalPeak) {
      noble.attributes.strength = Math.max(3, noble.attributes.strength - Math.random() * 0.5)
      noble.attributes.dexterity = Math.max(3, noble.attributes.dexterity - Math.random() * 0.5)
      noble.attributes.constitution = Math.max(3, noble.attributes.constitution - Math.random() * 0.3)
    } else if (noble.age > noble.race.maturityAge) {
      // Physical attributes can still improve until peak
      noble.attributes.strength += Math.random() * 0.3
      noble.attributes.dexterity += Math.random() * 0.3
      noble.attributes.constitution += Math.random() * 0.2
    }

    // Mental attributes improve until later peak
    if (noble.age <= mentalPeak) {
      noble.attributes.intelligence += Math.random() * 0.2
      noble.attributes.wisdom += Math.random() * 0.3
    }

    // Leadership and social skills improve with age
    if (ageRatio < 0.7) {
      noble.attributes.charisma += Math.random() * 0.2
    }

    // Log significant changes
    if (Math.random() < 0.1) {
      events.value.push({
        year: kingdom.value?.year || 0,
        type: 'evolution',
        message: `${noble.title} ${noble.name}'s attributes have evolved with age.`,
        details: {
          noble: {
            name: noble.name,
            title: noble.title,
            race: noble.race.name,
            age: noble.age,
            attributes: noble.attributes,
            specialFeatures: noble.specialFeatures.map(f => f.name)
          }
        }
      })
    }
  }

  const generateSpecialFeatures = (parent: Noble | null): SpecialFeature[] => {
    const features: SpecialFeature[] = []
    const availableFeatures = [...specialFeatures]
    
    if (parent) {
      // 70% chance to inherit each parent feature
      parent.specialFeatures.forEach(feature => {
        if (Math.random() < 0.7) {
          features.push(feature)
          const index = availableFeatures.findIndex(f => f.name === feature.name)
          if (index !== -1) {
            availableFeatures.splice(index, 1)
          }
        }
      })
    }

    // Add random features up to max
    const remainingFeatures = Math.floor(Math.random() * 3) + 1 // 1-3 additional features
    for (let i = 0; i < remainingFeatures && availableFeatures.length > 0; i++) {
      const index = Math.floor(Math.random() * availableFeatures.length)
      features.push(availableFeatures[index])
      availableFeatures.splice(index, 1)
    }
    
    return features
  }

  const maybeGainNewFeature = (noble: Noble) => {
    if (Math.random() < 0.05) { // 5% chance per year
      const availableFeatures = specialFeatures.filter(f => 
        !noble.specialFeatures.some(nf => nf.name === f.name)
      )
      
      if (availableFeatures.length > 0) {
        const newFeature = randomItem(availableFeatures)
        noble.specialFeatures.push(newFeature)
        events.value.push({
          year: kingdom.value?.year || 0,
          type: 'evolution',
          message: `${noble.title} ${noble.name} has gained a new feature: ${newFeature.name}`,
          details: {
            noble: {
              name: noble.name,
              title: noble.title,
              race: noble.race.name,
              age: noble.age,
              attributes: noble.attributes,
              specialFeatures: noble.specialFeatures.map(f => f.name)
            }
          }
        })
      }
    }
  }

  const calculatePower = (noble: Noble): number => {
    const attrBonus = (
      noble.attributes.strength * 0.5 + 
      noble.attributes.dexterity * 0.3 + 
      noble.attributes.constitution * 0.3 + 
      noble.attributes.intelligence * 0.4 + 
      noble.attributes.wisdom * 0.4 + 
      noble.attributes.charisma * 0.6
    ) / 20

    const featureBonus = noble.specialFeatures.reduce((sum, feature) => sum + feature.powerBonus, 0)
    const ageBonus = Math.min(noble.age / noble.race.maturityAge, 2)
    
    return (attrBonus + featureBonus) * ageBonus
  }

  const createNoble = (parent: Noble | null, house: NobleHouse): Noble => {
    const female = Math.random() < 0.5
    const race = parent ? parent.race : randomItem(races)
    const attributes = generateAttributes(parent)
    const specialFeatures = generateSpecialFeatures(parent)
    
    const names = namesByRace[race.name as keyof typeof namesByRace]
    const name = female ? randomItem(names.female) : randomItem(names.male)
    
    const noble: Noble = {
      name,
      title: female ? 'Lady' : 'Lord',
      sobriquet: '',
      nobleHouse: house,
      alive: true,
      notable: false,
      female,
      parent,
      children: [],
      age: parent ? 0 : Math.floor(Math.random() * (race.maxLifespan / 3)),
      ageAtAscension: 0,
      prestige: parent ? (parent.prestige * 0.75) : (house.power / 2 + Math.random() * house.power / 2),
      hadChildThisYear: false,
      race,
      attributes,
      specialFeatures,
      power: 0
    }

    noble.power = calculatePower(noble)
    house.livingNobles.push(noble)
    return noble
  }

  const initializeNobles = (house: NobleHouse) => {
    for (let i = 0; i < house.maxSize; i++) {
      createNoble(null, house)
    }
    house.leader = findMostPowerfulNoble(house)
  }

  const findMostPowerfulNoble = (house: NobleHouse): Noble => {
    return house.livingNobles.reduce((prev, current) => 
      (current.power + current.prestige) > (prev.power + prev.prestige) ? current : prev
    )
  }

  const initializeKingdom = () => {
    kingdom.value = {
      nobleHouses: [],
      rulerList: [],
      monumentList: [],
      destroyedMonumentList: [],
      warList: [],
      otherKingdoms: [],
      otherKingdomsAtPeace: [],
      year: 0,
      rulingHouse: null,
      ruler: null
    }

    config.value.otherKingdoms.forEach(name => {
      const otherKingdom: OtherKingdom = { name }
      kingdom.value!.otherKingdoms.push(otherKingdom)
      kingdom.value!.otherKingdomsAtPeace.push(otherKingdom)
    })

    config.value.nobleHouseNames.forEach(name => {
      const house: NobleHouse = {
        name,
        maxSize: 1000,
        deadNobles: [],
        livingNobles: [],
        power: Math.floor(Math.random() * 10),
        leader: null,
        regent: null
      }
      kingdom.value!.nobleHouses.push(house)
      initializeNobles(house)
    })

    findNewRuler()
  }

  const findNewRuler = () => {
    if (!kingdom.value) return

    const greatestHouse = kingdom.value.nobleHouses.reduce((prev, current) => {
      const prevPower = prev.power + (prev.leader?.power || 0) + (prev.leader?.prestige || 0)
      const currentPower = current.power + (current.leader?.power || 0) + (current.leader?.prestige || 0)
      return currentPower > prevPower ? current : prev
    })

    if (!kingdom.value.rulingHouse) {
      anointRuler(greatestHouse.leader!)
      return
    }

    if (config.value.allowUsurping && greatestHouse !== kingdom.value.rulingHouse) {
      events.value.push({
        year: kingdom.value.year,
        type: 'ascension',
        message: `House ${greatestHouse.name} has usurped House ${kingdom.value.rulingHouse.name}!`,
        details: {
          noble: {
            name: greatestHouse.leader!.name,
            title: greatestHouse.leader!.title,
            race: greatestHouse.leader!.race.name,
            age: greatestHouse.leader!.age,
            attributes: greatestHouse.leader!.attributes,
            specialFeatures: greatestHouse.leader!.specialFeatures.map(f => f.name)
          }
        }
      })
      anointRuler(greatestHouse.leader!)
    } else {
      anointRuler(kingdom.value.rulingHouse.leader!)
    }
  }

  const anointRuler = (noble: Noble) => {
    if (!kingdom.value) return

    kingdom.value.ruler = noble
    kingdom.value.rulingHouse = noble.nobleHouse
    noble.notable = true
    noble.prestige += 3
    noble.ageAtAscension = noble.age
    noble.title = noble.female ? 'Queen' : 'King'
    noble.sobriquet = `the ${randomItem(sobriquets)}`

    noble.children.forEach(child => {
      child.title = child.female ? 'Duchess' : 'Duke'
    })

    kingdom.value.rulerList.push(noble)

    if (config.value.inlineAscensions) {
      events.value.push({
        year: kingdom.value.year,
        type: 'ascension',
        message: `All hail ${noble.title} ${noble.name} ${noble.sobriquet} of House ${noble.nobleHouse.name}!`,
        details: {
          noble: {
            name: noble.name,
            title: noble.title,
            race: noble.race.name,
            age: noble.age,
            attributes: noble.attributes,
            specialFeatures: noble.specialFeatures.map(f => f.name)
          }
        }
      })
    }
  }

  const generateKingdom = async () => {
    isGenerating.value = true
    events.value = []
    initializeKingdom()

    for (let year = 0; year < config.value.yearsToSimulate; year++) {
      await advanceYear()
      await new Promise(resolve => setTimeout(resolve, 10))
    }

    isGenerating.value = false
  }

  const advanceYear = async () => {
    if (!kingdom.value) return

    kingdom.value.year++
    const currentYear = kingdom.value.year

    kingdom.value.nobleHouses.forEach(house => {
      advanceNobleHouse(house)
    })

    if (Math.random() < 0.02) {
      const monument: Monument = {
        name: `${randomItem(monumentTypes)} of ${kingdom.value.ruler?.name || 'the Realm'}`,
        yearBuilt: currentYear,
        duration: 0,
        resolution: ''
      }
      kingdom.value.monumentList.push(monument)
      if (config.value.inlineMonuments) {
        events.value.push({
          year: currentYear,
          type: 'monument',
          message: `The ${monument.name} has been constructed!`
        })
      }
    }

    if (Math.random() < 0.02 && kingdom.value.otherKingdomsAtPeace.length > 0) {
      const opponent = randomItem(kingdom.value.otherKingdomsAtPeace)
      const war: War = { 
        opponent, 
        duration: 0,
        casualties: 0,
        victories: 0,
        defeats: 0
      }
      kingdom.value.warList.push(war)
      kingdom.value.otherKingdomsAtPeace = kingdom.value.otherKingdomsAtPeace.filter(k => k !== opponent)
      if (config.value.inlineWars) {
        events.value.push({
          year: currentYear,
          type: 'war',
          message: `War has broken out with ${opponent.name}!`
        })
      }
    }

    kingdom.value.warList.forEach(war => {
      war.duration++
      const militaryPower = kingdom.value!.nobleHouses.reduce((total, house) => {
        return total + house.livingNobles.reduce((housePower, noble) => {
          return housePower + (noble.attributes.strength + noble.attributes.dexterity) / 2
        }, 0)
      }, 0)

      if (Math.random() < 0.3) {
        const battleResult = Math.random() * militaryPower > 100
        if (battleResult) {
          war.victories++
          events.value.push({
            year: currentYear,
            type: 'combat',
            message: `Our forces achieved victory against ${war.opponent.name}!`,
            details: {
              warStats: {
                casualties: war.casualties,
                victories: war.victories,
                defeats: war.defeats
              }
            }
          })
        } else {
          war.defeats++
          war.casualties += Math.floor(Math.random() * 100)
          events.value.push({
            year: currentYear,
            type: 'combat',
            message: `Our forces suffered a defeat against ${war.opponent.name}.`,
            details: {
              warStats: {
                casualties: war.casualties,
                victories: war.victories,
                defeats: war.defeats
              }
            }
          })
        }
      }
    })

    if (Math.random() < 0.1 && kingdom.value.warList.length > 0) {
      const warToEnd = randomItem(kingdom.value.warList)
      kingdom.value.warList = kingdom.value.warList.filter(w => w !== warToEnd)
      kingdom.value.otherKingdomsAtPeace.push(warToEnd.opponent)
      if (config.value.inlineWars) {
        events.value.push({
          year: currentYear,
          type: 'war',
          message: `Peace has been achieved with ${warToEnd.opponent.name} after ${warToEnd.duration} years of war.`,
          details: {
            warStats: {
              casualties: warToEnd.casualties,
              victories: warToEnd.victories,
              defeats: warToEnd.defeats
            }
          }
        })
      }
    }

    if (currentYear % config.value.nobleReviewPeriod === 0) {
      events.value.push({
        year: currentYear,
        type: 'review',
        message: generateKingdomReview()
      })
    }
  }

  const advanceNobleHouse = (house: NobleHouse) => {
    house.livingNobles.forEach(noble => {
      noble.age++
      noble.hadChildThisYear = false
      noble.prestige += Math.random() * 0.3

      evolveAttributes(noble)
      maybeGainNewFeature(noble)
      noble.power = calculatePower(noble)

      const ageRatio = noble.age / noble.race.maxLifespan
      const baseDeathChance = 0.04
      const ageDeathChance = ageRatio * ageRatio * 0.5
      const constitutionBonus = (noble.attributes.constitution - 10) * 0.01
      
      if (Math.random() < (baseDeathChance + ageDeathChance - constitutionBonus)) {
        nobleDeaths(noble)
      }
    })

    const eliteCount = Math.min(house.maxSize / 3, house.livingNobles.length)
    const sortedNobles = [...house.livingNobles].sort((a, b) => (b.power + b.prestige) - (a.power + a.prestige))
    
    for (let i = 0; i < eliteCount; i++) {
      const noble = sortedNobles[i]
      if (Math.random() < getChildChance(noble)) {
        createNoble(noble, house)
      }
    }

    house.power = house.livingNobles.reduce((total, noble) => total + noble.power, 0) / house.livingNobles.length
  }

  const getChildChance = (noble: Noble): number => {
    if (noble.age < noble.race.maturityAge) return 0
    if (noble.female) {
      const fertilityPeak = noble.race.maturityAge + (noble.race.maxLifespan - noble.race.maturityAge) * 0.2
      const ageFactor = 1 - Math.abs(noble.age - fertilityPeak) / (noble.race.maxLifespan - noble.race.maturityAge)
      return Math.max(0, 0.3 * ageFactor)
    }
    return 0.25
  }

  const nobleDeaths = (noble: Noble) => {
    noble.alive = false
    noble.nobleHouse.livingNobles = noble.nobleHouse.livingNobles.filter(n => n !== noble)
    noble.nobleHouse.deadNobles.push(noble)

    if (noble === noble.nobleHouse.leader) {
      noble.nobleHouse.leader = findMostPowerfulNoble(noble.nobleHouse)
    }

    if (noble === kingdom.value?.ruler) {
      findNewRuler()
    }

    if (noble.notable && config.value.inlineDeaths) {
      events.value.push({
        year: kingdom.value?.year || 0,
        type: 'death',
        message: `${noble.title} ${noble.name} has died at age ${noble.age}.`,
        details: {
          noble: {
            name: noble.name,
            title: noble.title,
            race: noble.race.name,
            age: noble.age,
            attributes: noble.attributes,
            specialFeatures: noble.specialFeatures.map(f => f.name)
          }
        }
      })
    }
  }

  const generateKingdomReview = (): string => {
    if (!kingdom.value) return ''

    const ruler = kingdom.value.ruler
    let review = `Kingdom Review - Year ${kingdom.value.year}\n`
    review += `Ruler: ${ruler?.title} ${ruler?.name} ${ruler?.sobriquet}\n`
    review += `Race: ${ruler?.race.name} (Age: ${ruler?.age})\n`
    review += `Power: ${ruler?.power.toFixed(1)}\n`
    review += `Attributes: STR ${ruler?.attributes.strength.toFixed(1)}, DEX ${ruler?.attributes.dexterity.toFixed(1)}, `
    review += `CON ${ruler?.attributes.constitution.toFixed(1)}, INT ${ruler?.attributes.intelligence.toFixed(1)}, `
    review += `WIS ${ruler?.attributes.wisdom.toFixed(1)}, CHA ${ruler?.attributes.charisma.toFixed(1)}\n`
    review += `Special Features: ${ruler?.specialFeatures.map(f => f.name).join(', ')}\n\n`
    review += `Noble Houses:\n`
    
    kingdom.value.nobleHouses.forEach(house => {
      const raceCount = house.livingNobles.reduce((acc, noble) => {
        acc[noble.race.name] = (acc[noble.race.name] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const avgPower = house.livingNobles.reduce((sum, noble) => sum + noble.power, 0) / house.livingNobles.length
      
      review += `- House ${house.name}:\n`
      review += `  Living Nobles: ${house.livingNobles.length}, Avg Power: ${avgPower.toFixed(1)}\n`
      review += `  Races: ${Object.entries(raceCount).map(([race, count]) => `${race}: ${count}`).join(', ')}\n`
    })

    return review
  }

  return {
    kingdom,
    events,
    isGenerating,
    currentYear,
    config,
    generateKingdom
  }
}
