import type { Protocol } from "@/engine/types";

/**
 * The protocol library, organised by goal. Clients and marketing see goals;
 * internal tags stay inside the library, visible only to licensed users.
 *
 * PLACEHOLDER point prescriptions (classical, to confirm). Dr. Amina writes
 * every protocol; nothing enters the live library without her approval.
 */
export const PROTOCOLS: Protocol[] = [
  {
    id: "support-earth",
    goal: "Digestion and steady energy",
    internalTag: "Spleen qi deficiency · dampness",
    focus: "earth",
    action: "tonify",
    tcmView:
      "Your centre, the Earth that feeds every other part of you, was running quiet while the Wood around it pushed hard. Today we gave the centre back its warmth, so the rest can settle around it.",
    deviceSettings: [
      { frequency: "0.3 Hz / 40 Hz", waveform: "Rolling", mode: "probe" },
      { frequency: "10 Hz", waveform: "Sine", mode: "plates" },
    ],
    homeAdvice: ["Warm cooked meals", "An early night", "A short walk after lunch"],
    nextVisitDays: 7,
    points: [
      { code: "SP 6", name: "Sanyinjiao", location: "Inner lower leg, four finger-widths above the ankle bone, just behind the shin bone", seconds: 30, element: "earth", mode: "probe", intensity: 3, why: "Meets the three yin channels; the first door into the centre" },
      { code: "ST 36", name: "Zusanli", location: "Outer lower leg, four finger-widths below the kneecap, one finger-width toward the outside of the shin bone", seconds: 30, element: "earth", mode: "probe", intensity: 3, why: "The great tonifying point; steadies digestion and energy" },
      { code: "CV 12", name: "Zhongwan", location: "Midline of the belly, halfway between the navel and the base of the breastbone", seconds: 25, element: "earth", mode: "probe", intensity: 2, why: "Alarm point of the Stomach; warms the centre directly" },
      { code: "LV 3", name: "Taichong", location: "Top of the foot, in the hollow where the first and second toe bones meet", seconds: 20, element: "wood", mode: "probe", intensity: 2, why: "Lets the over-acting Wood ease off the Earth" },
    ],
  },
  {
    id: "head-comfort",
    goal: "Head comfort",
    internalTag: "Migraine · tension headache",
    focus: "wood",
    action: "sedate",
    tcmView:
      "Wood rose too fast and too high, like heat climbing a chimney. Today we opened the gates at the hands and feet so the rising could come back down.",
    deviceSettings: [
      { frequency: "0.5 Hz / 80 Hz", waveform: "Rolling", mode: "probe" },
      { frequency: "4 Hz", waveform: "Sine", mode: "ear-clips" },
    ],
    homeAdvice: ["Water before coffee", "Screens off an hour before bed", "Loosen the jaw when you notice it"],
    nextVisitDays: 5,
    points: [
      { code: "GB 20", name: "Fengchi", location: "Back of the skull, in the hollows either side of the big neck muscles, just under the bone", seconds: 30, element: "wood", mode: "probe", intensity: 3, why: "Clears wind from the head" },
      { code: "LI 4", name: "Hegu", location: "Back of the hand, in the fleshy web between thumb and index finger", seconds: 25, element: "metal", mode: "probe", intensity: 3, why: "The face and head's master point" },
      { code: "LV 3", name: "Taichong", location: "Top of the foot, in the hollow where the first and second toe bones meet", seconds: 25, element: "wood", mode: "probe", intensity: 3, why: "With LI 4, the four gates: moves what is stuck" },
      { code: "Taiyang", name: "Taiyang", location: "Temple, in the slight hollow a thumb-width behind the outer corner of the eye", seconds: 20, element: "fire", mode: "probe", intensity: 1, why: "Local relief where it is felt" },
    ],
  },
  {
    id: "emotional-balance",
    goal: "Calm and emotional balance",
    internalTag: "Anxiety · low mood · stress",
    focus: "fire",
    action: "tonify",
    tcmView:
      "The Fire that lights the mind had grown flickery, bright one minute and gone the next. Today we steadied the lamp so the room stays lit.",
    deviceSettings: [
      { frequency: "0.3 Hz / 20 Hz", waveform: "Sine", mode: "ear-clips" },
      { frequency: "7.8 Hz", waveform: "Sine", mode: "headband" },
    ],
    homeAdvice: ["Four slow breaths before each meal", "Sunlight on the face before noon", "One thing finished before the next is started"],
    nextVisitDays: 7,
    points: [
      { code: "HT 7", name: "Shenmen", location: "Wrist crease, little-finger side, in the hollow just inside the tendon", seconds: 30, element: "fire", mode: "probe", intensity: 2, why: "Spirit gate; calms the mind" },
      { code: "PC 6", name: "Neiguan", location: "Inner forearm, three finger-widths above the wrist crease, between the two tendons", seconds: 25, element: "fire", mode: "probe", intensity: 2, why: "Settles the chest and the nausea of worry" },
      { code: "Yintang", name: "Yintang", location: "Between the eyebrows, at the root of the nose", seconds: 20, element: "fire", mode: "probe", intensity: 1, why: "Quiets the forehead" },
      { code: "LV 3", name: "Taichong", location: "Top of the foot, in the hollow where the first and second toe bones meet", seconds: 20, element: "wood", mode: "probe", intensity: 2, why: "Unknots the Wood that feeds the Fire" },
    ],
  },
  {
    id: "restful-sleep",
    goal: "Restful sleep",
    internalTag: "Insomnia",
    focus: "fire",
    action: "sedate",
    tcmView:
      "The Fire would not go down to the Water at night, so the mind kept the lights on. Today we showed it the way back down.",
    deviceSettings: [{ frequency: "2 Hz", waveform: "Sine", mode: "ear-clips" }],
    homeAdvice: ["Last meal three hours before bed", "A warm foot bath", "Same wake time every day"],
    nextVisitDays: 7,
    points: [
      { code: "HT 7", name: "Shenmen", location: "Wrist crease, little-finger side, in the hollow just inside the tendon", seconds: 30, element: "fire", mode: "probe", intensity: 2, why: "Calms the mind" },
      { code: "SP 6", name: "Sanyinjiao", location: "Inner lower leg, four finger-widths above the ankle bone, behind the shin bone", seconds: 30, element: "earth", mode: "probe", intensity: 2, why: "Nourishes yin so the night can hold" },
      { code: "Anmian", name: "Anmian", location: "Behind the ear, halfway between the bony bump and the hollow at the base of the skull", seconds: 25, element: "water", mode: "probe", intensity: 1, why: "Peaceful sleep point" },
    ],
  },
  {
    id: "back-comfort",
    goal: "Back comfort",
    internalTag: "Low back pain",
    focus: "water",
    action: "tonify",
    tcmView:
      "The Water that holds up the lower back had run low, and the structure was carrying more than it should. Today we refilled the reservoir.",
    deviceSettings: [
      { frequency: "0.3 Hz / 40 Hz", waveform: "Rolling", mode: "plates" },
      { frequency: "0.5 Hz", waveform: "Square", mode: "probe" },
    ],
    homeAdvice: ["Keep the lower back warm", "Walk before you sit", "Lift with the hips, not the waist"],
    nextVisitDays: 5,
    points: [
      { code: "BL 23", name: "Shenshu", location: "Lower back, two finger-widths either side of the spine at the level of the waist", seconds: 30, element: "water", mode: "probe", intensity: 3, why: "Kidney transport point; the root of the back" },
      { code: "BL 40", name: "Weizhong", location: "Centre of the crease at the back of the knee", seconds: 25, element: "water", mode: "probe", intensity: 3, why: "Command point for the back" },
      { code: "GV 4", name: "Mingmen", location: "Midline of the lower back, between the second and third lumbar bones", seconds: 25, element: "water", mode: "probe", intensity: 2, why: "Gate of life; warms the yang" },
      { code: "KI 3", name: "Taixi", location: "Inner ankle, in the hollow between the ankle bone and the Achilles tendon", seconds: 20, element: "water", mode: "probe", intensity: 2, why: "Source point of the Kidney" },
    ],
  },
  {
    id: "knee-recovery",
    goal: "Knee recovery",
    internalTag: "Meniscus · ligament",
    focus: "wood",
    action: "tonify",
    tcmView:
      "Wood governs the sinews. The knee's ropes had gone slack on one side and tight on the other; today we evened the tension.",
    deviceSettings: [
      { frequency: "0.3 Hz / 20 Hz", waveform: "Rolling", mode: "probe" },
      { frequency: "60 Hz", waveform: "Sine", mode: "myopulse" },
    ],
    homeAdvice: ["Gentle straight-leg raises, ten a day", "Ice only after activity", "Stairs one at a time this week"],
    nextVisitDays: 4,
    points: [
      { code: "ST 35", name: "Dubi", location: "Outer hollow just below the kneecap, with the knee bent", seconds: 25, element: "earth", mode: "probe", intensity: 3, why: "Local point, outer eye of the knee" },
      { code: "Xiyan", name: "Inner Xiyan", location: "Inner hollow just below the kneecap, with the knee bent", seconds: 25, element: "earth", mode: "probe", intensity: 3, why: "Local point, inner eye of the knee" },
      { code: "GB 34", name: "Yanglingquan", location: "Outer lower leg, in the hollow just below and in front of the head of the fibula", seconds: 30, element: "wood", mode: "probe", intensity: 3, why: "Influential point of the sinews" },
      { code: "SP 9", name: "Yinlingquan", location: "Inner lower leg, in the hollow below the knee where the shin bone flares", seconds: 25, element: "earth", mode: "probe", intensity: 2, why: "Drains damp from the joint" },
    ],
  },
  {
    id: "steadiness",
    goal: "Steadiness and balance",
    internalTag: "Polyneuropathy · vertigo · gait",
    focus: "water",
    action: "tonify",
    tcmView:
      "When the Water is low the Wood has nothing to root in, and the body sways. Today we fed the roots and the trunk steadied.",
    deviceSettings: [{ frequency: "0.3 Hz / 40 Hz", waveform: "Rolling", mode: "probe" }],
    homeAdvice: ["Stand on one foot while brushing teeth", "Barefoot on grass when you can", "Warm feet at night"],
    nextVisitDays: 3,
    points: [
      { code: "GV 20", name: "Baihui", location: "Crown of the head, where a line up from the ear tips meets the midline", seconds: 25, element: "water", mode: "probe", intensity: 1, why: "Lifts and steadies" },
      { code: "GB 20", name: "Fengchi", location: "Back of the skull, in the hollows beside the big neck muscles", seconds: 25, element: "wood", mode: "probe", intensity: 2, why: "Clears the head" },
      { code: "GB 34", name: "Yanglingquan", location: "Outer lower leg, below and in front of the head of the fibula", seconds: 30, element: "wood", mode: "probe", intensity: 3, why: "The sinews" },
      { code: "ST 36", name: "Zusanli", location: "Outer lower leg, four finger-widths below the kneecap", seconds: 30, element: "earth", mode: "probe", intensity: 3, why: "Strength in the legs" },
      { code: "GB 39", name: "Xuanzhong", location: "Outer lower leg, three finger-widths above the ankle bone, in front of the fibula", seconds: 25, element: "wood", mode: "probe", intensity: 2, why: "Influential point of the marrow" },
      { code: "ST 41", name: "Jiexi", location: "Front of the ankle, in the hollow between the two big tendons", seconds: 20, element: "earth", mode: "probe", intensity: 2, why: "Ankle stability" },
    ],
  },
];

export const PROTOCOL_BY_ID = Object.fromEntries(PROTOCOLS.map((p) => [p.id, p]));

/** Goals shown on the intake. Element is the primary element they map to. */
export const GOALS = PROTOCOLS.map((p) => ({ id: p.id, label: p.goal, element: p.focus }));
