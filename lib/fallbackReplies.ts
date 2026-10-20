import type { Voice } from "./prompts";

export const fallbackReplies: Record<Voice, string[]> = {
  relative: [
    "Beta, in my time we had bigger problems and smaller complaints. Drink some water and try again tomorrow.",
    "Arre, Sharma ji's son never complains. That is why he is in America.",
    "Beta, complaining burns more calories than solving. At least you are getting exercise.",
    "In my time we walked 5 km to college, uphill, both ways. You will survive this.",
    "Beta, have you tried sleeping early? It fixes everything, I read it on WhatsApp.",
    "Arre, problems are temporary, but this complaint is now permanent in our records.",
    "Beta, we have noted your complaint. Now please note our advice: adjust karo.",
    "Sharma ji's daughter also had this problem. She became a topper, what is your excuse?",
    "Beta, in my time there was no complaint box. We complained to the wall and the wall listened.",
    "Arre, don't take tension. Take chai, it is cheaper and comes with biscuit.",
    "Beta, this is what happens when you skip breakfast. Eat a paratha and see the difference.",
    "In my time we solved this with one tight slap of discipline. Now you have apps for it.",
    "Beta, your complaint has been forwarded to the Department of Kal Dekhenge.",
    "Arre, at your age I was already handling three problems and a scooter. Chalo, stay strong.",
    "Beta, complaining is fine, but have you prayed to the WiFi router? Try once.",
    "Sharma ji's son read this complaint and laughed. Then he went back to studying.",
    "Beta, life is like a canteen queue. Slow, crowded, and the samosa is always finished.",
    "In my time we didn't have opinions, we had homework. Be grateful.",
    "Beta, put this complaint in a file, put the file in a drawer, and forget the drawer. Problem solved.",
    "Arre, everything was better in our time. Except the WiFi, which did not exist.",
  ],
  meme: [
    "Picture abhi baaki hai mere dost. This is only the first half of your problem.",
    "Kitne aadmi the? Doesn't matter, the complaint is still pending.",
    "Mogambo khush hua. Your complaint has been received with great joy and zero action.",
    "Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hain. Chill karo.",
    "Utha le re baba, but please take this complaint with you.",
    "Ye toh bada toing hai. We will look into it, someday.",
    "Rasode mein kaun tha? Nobody, and that is exactly the problem.",
    "Bhai kya kar raha hai tu? Complaining to a post box, very brave.",
    "Mujhe toh pehle se pata tha. This was always going to happen.",
    "Thoda adjust kar lo. That is our official policy.",
    "Aap chronology samajhiye: first problem, then complaint, then nothing.",
    "Kuch toh gadbad hai, Daya. Probably everything.",
    "Hum kahan aa gaye. From hope to complaint box in one day.",
    "Tension lene ka nahi, sirf dene ka. Forwarding yours to the next person.",
    "All izz well. Please do not check if it actually is.",
    "Paisa hi paisa hoga. Just not for fixing this.",
    "Don't underestimate the power of a common complaint. It can be ignored very efficiently.",
    "Main apni favourite hoon, and this complaint is not.",
    "Jab main chhota baccha tha, this problem was already there. Classic.",
    "Picture abhi baaki hai mere dost. Stay for the post-credits disappointment.",
  ],
};

// For complaints blocked by moderation: gentle, never accusing.
export const deflections = [
  "Beta, the post office does not deliver that kind of letter. Write something else, something nice.",
  "Arre, this one got lost in the mail. Try a different shikayat?",
  "The postman read it and quietly cycled away. Let's keep it friendly, yaar.",
  "This letter needs more stamps of kindness. Try again with a different complaint.",
  "Beta, even Sharma ji would not post this. Write a cleaner shikayat.",
  "Return to sender: this one is not for the post box. What else is bothering you?",
];

export const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
