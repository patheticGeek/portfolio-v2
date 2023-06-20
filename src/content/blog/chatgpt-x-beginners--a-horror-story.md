---
title: 'ChatGPT x Beginners - a horror story'
description: 'How your bff can be your enemy'
pubDate: 'Jun 20 2023'
---

So you've started learning coding, and there's this amazing thing which can solve all your problems if you tell it.
Amazing right?

Can't say it louder, **NO**

There is a lot of issues you will find with it if you know even a little bit about what you're doing.
There's places it can help a lot, and there's a lot of times it will be hurting you a lot and just bluntly wasting your time & keeping you back.

### It doesn't know shit

What is ChatGPT, or Co-pilot or CodeWisper under the hood?

They basically just boil down to next-word guessers. This is an extreme over simplification, but this is where the problem starts.
They aren't meant to _think_ or apply logic, they are just meant to guess the next word with the highest accuracy they can.
They don't know shit about the data they are being fed, whats fact and whats bullshit. They will just try to _guess_.

This makes them bad at everything by default, other than for the top bar on your keyboard which auto suggests words
or something what can help you write way better English than you can ever write.

### You're being lead by a _pretender_

Now lets say you're learning something new and you have a bug.
What do you do? Go to ChatGPT and type in the error message?

But wait,
it doesn't have any context of the tutorial you're following,
it doesn't know fully about all the pieces you're using,
it doesn't know about how other parts of your project are set up,
_it doesn't know shit_

But yet it will try to generate a response and give you, would could range from utter garbage making you even more confused to exactly what you needed.
And both cases _are bad_.

If its a utter garbage response, you're gonna waste time to get it to reply correctly, trying to understand what it wants you to do.
And if its exactly what you're looking for, congrats you're now skipping the most valuable phase of the learning process, the research, finding resources, reading docs.

So in both cases, using it is actually being harmful for you.

Also, as it is lacking all the context about what you're doing it doesn't know how to make things so that they are able to change with the upcoming or future requirements.
This makes it produce really unmaintainable code which might get you 95% of the way there, but going from even 95 -> 96% might require you to rewrite it completely.

### Where you should actually use it

Use it for its intended purpose i.e. generating English text, think emails, messages, intros, resume etc.

You can also use them for getting features/requirements for a beginner project where you're not sure what all you should make.
Take a look at my question [here](https://shareg.pt/k7V0E65) , prompt it to break these things down even further.
Ask it to give you a list of screens and what each screen should contain and start building with that.

Use it with a limit scope where it knows everything.
e.g. Generating one off scripts, generating regex etc.
Need a script to delete all `node_modules` folder recursively in current directory, go ahead let it make it and verify before running. Need to get regex for email, ask it.

Use it to generate boring repetitive lines of code. e.g. a list countries with their country code, or generating a translation file like English to German.

## Final note

It has its advantages and disadvantages, remember in mind its strengths and do not try to hack it t do everything for you.

Lead it to generate what you want, don't try to make it lead you in fixing bugs or generating code.

Remember, it doesn't have all the knowledge that _you_ have, sometimes even without knowing it.
