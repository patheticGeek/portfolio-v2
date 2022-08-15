---
layout: "../../layouts/BlogPost.astro"
title: "Component State — React state management techniques"
description: ""
pubDate: "Jul 29 2021"
heroImage: "/assets/blog/react-state-management-techniques.png"
---

## Introduction

The basic idea of this is to provide you a guide on how to create a basic project with all these state management techniques like you're a baby. That will help you choose which one will be best and when you should probably move to something better.

If you're struggling with any concept, search it on YouTube and come back and continue. I have tried my best to boil things down, but I could be missing something. And do leave feedback at the end. :)

## Component State

So you've just learned the shiny new thing called `react` and in there you've seen that there are these things called hooks and the first one is `useState`. Now, what does it do? You might judge by its name, it looks like it might be related to doing something with some state, and you'll be right!

## Basic usage

The `useState` hook used to store some state for that particular component. And is used like,

```jsx
function App() {
  const [name, setName] = useState("");

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Your name is: {name}, as if you didn't know already.</p>
    </div>
  );
}
```

When we use this hook we get 2 things, one is the value stored and the other is a function to set its value. Here we have `name` as a value and `setName` a function to set its value.
Now, the `setName` function can also be used as below,

```jsx
const addPronouns = () => {
  setName((oldValue) => oldValue + " (lmao/ded)");
};
```

We can pass the `setName` a function and the function gets the old value of it, and then we can return a new value based on that old value.

## Usage with arrays and objects

This has been pretty simple, right? We can update the string, numbers and booleans easily. Now, with array and objects, we might need a few helpers. Here are a few functions I always create if I am going to any of these operations in more than two places because it's easy to make mistakes, and it will save a lot of headache.

### Arrays

Let's see how we can handle an array of, umm, people I hate

```jsx
function PeopleIHate() {
	const [people, setPeople] = useState([ 'everyone' ])

	// used to add to the array
	const add = (name) => {
		// we create a new array and spread people in it
		// then add the new name to the end
		const value = [ ...people, name ]
		// and now we set the new value
		setPeople(value)
	}

	// used to delete from the array
	const delete = (index) => {
		// We use array.filter method to remove the value at that index
		// It is important to use index or some kind of id because
		// we can have people with same name
		const value = people.filter((_, idx) => idx !== index)
		// and now we set the new value
		setPeople(value)
	}

	// update a value in the array
	const update = (index, newVal) => {
		const value = people.map((value, idx) => {
			// We check if this is the index we need to update
			// if it is return newVal or else return existing value
			return idx === index ? newVal : value
		})
		// and now we set the new value
		setPeople(people)
	}

	return null // An exercise for the reader
}
```

And now we can use these functions whenever we need to do one of these operations.
Don't get all scared by the size of this, if you remove comments and do some fancy syntax, this will be at most ~8 lines.

### Objects

Objects are pretty simple to do, we only have one update function.
Let's say we want to store the user object,

```jsx
function SettingsPage() {
  const [user, setUser] = useState({
    username: "pathetic_geek",
    avatar: "https://www.secretrickroll.com/assets/opt2.jpg",
    // ...other stuff
  });

  // used to update the user object, should be called like
  // update({ username: 'noobslayer69' })
  const update = (newValue) => {
    // We create an object then put the value of users object in it
    // and then we override it with whatever is in the newValue object
    // The ... used here are called spread operators
    const value = { ...user, ...newValue };
    // and now we set the new value
    setUser(value);
  };
}
```

And this is how we can manage the state inside one component using the `useState` hook.

## Final notes

This is used only when the value you are storing is needed in just one component or just the component and one or two of its children. So the examples can be when you are making a form and need to store the input values.
If you need to access to the value or update it from even more places, you probably should start using context or redux.

In the next part, we'll see how we can create a user state using react context and reducer.
