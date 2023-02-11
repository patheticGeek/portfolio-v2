---
title: 'React state management on crack'
description: ''
pubDate: 'Jul 18 2021'
heroImage: '/assets/blog/react-state-mgmt-on-crack.png'
---

Every application needs some kind of state management. Let's start with the most basic one, and we will see how things change with scale.

## 2.1 Creating a basic global store

The idea here is to have a `useState` that will store our state and update it, and then we will use [react context](https://reactjs.org/docs/context.html) to pass it down to components.

So now we will create a new context named `StoreContext` and in its value the first item will be the store itself and the second item will be setStore so that we can update it.

```jsx
import React, { createContext, useContext, useMemo, useState } from 'react'

const StoreContext = createContext()

export const StoreProvider = ({ children, initialState }) => {
  const [store, setStore] = useState(initialState)

  const contextValue = useMemo(() => [store, setStore], [store])

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  return useContext(StoreContext)
}

export default StoreContext
```

## 2.2 Some things don't seem right

There's only so much growing your store can do with `useState` and at one point it will become a PIA to update your store using setStore. So let's add a `useReducer` in here and now our code looks something like,

```jsx
import React, { createContext, useContext, useMemo, useReducer } from 'react'

const StoreContext = createContext()

export const StoreProvider = ({ children, initialState, reducer }) => {
  const [store, dispatch] = useReducer(reducer, initialState)

  const contextValue = useMemo(() => [store, dispatch], [store])

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  return useContext(StoreContext)
}

export default StoreContext
```

The problem with context is whenever it changes the whole tree under it re-renders, and that can be a huge performance issue. So even if we are just dispatching an action, our component will re-render. Now to fix that, let's create a different context for storing the dispatch function, and we will use it with a `useDispatch` hook.

```jsx
import React, { createContext, useContext, useReducer } from 'react'

const StoreContext = createContext()
export const DispatchContext = createContext()

export const StoreProvider = ({ initialState, reducer, children }) => {
  const [store, dispatch] = useReducer(reducer, initialState)

  return (
    <DispatchContext.Provider value={dispatch}>
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    </DispatchContext.Provider>
  )
}

export const useStore = () => {
  return useContext(StoreContext)
}

export const useDispatch = () => {
  return useContext(DispatchContext)
}

export default StoreContext
```

And how we use this is by wrapping our `App` first in `DispatchContext` and then `StoreContext` and then in our component

```jsx
import React, { useRef } from 'react'

import { useDispatch, useStore } from '@state/context-reducer'

const Example = () => {
  const dispatch = useDispatch()
  const store = useStore()

  return (
    <div className="my-3">
      <p>{JSON.stringify(store)}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>Dispatch</button>
    </div>
  )
}

export default Example
```

## 2.3 One step further

So, _only one global state?_ You might be wondering.

**Rolls up my sleeves** And here is where generator function comes in. Basically, we can make a function `makeStore` that takes in the reducer and initialState, and gives us a provider, a useStore and a useDispatch, so that we can easily make multiple stores.

```jsx
import React, { createContext, useContext, useReducer } from 'react'

export default function makeStore(reducer, initialState) {
  const StoreContext = createContext(null)
  const DispatchContext = createContext(null)

  const StoreProvider = ({ children }) => {
    const [store, dispatch] = useReducer(reducer, initialState)

    return (
      <DispatchContext.Provider value={dispatch}>
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
      </DispatchContext.Provider>
    )
  }

  const useStore = () => {
    return useContext(StoreContext)
  }

  const useDispatch = () => {
    return useContext(DispatchContext)
  }

  return [StoreProvider, useStore, useDispatch]
}
```

And now we can make as many stores as we want!

```jsx
const [LayoutStore, useLayout, useLayoutDispatch] = makeStore(layoutReducer, {
  menuOpen: false
})
const [TodoStore, useTodo, useTodoDispatch] = makeStore(todosReducer, [])
```

## 2.4 And now the cherry on top

_But what about persistence?_ You ask.

_What about it?_ I say and just add a few lines of code in our `makeStore` function:

```jsx
export default function makeStore(reducer, initialState, key) {
  const StoreContext = createContext(null)
  const DispatchContext = createContext(null)

  let finalInitialState = null
  try {
    finalInitialState = JSON.parse(localStorage.getItem(key)) || initialState
  } catch (e) {}

  const finalReducer = (state, action) => {
    const newState = reducer(state, action)
    localStorage.saveItem(key, JSON.stringify(newState))
    return newState
  }

  // And now we use finalInitialState and finalReducer
  // instead of reducer and initialState
}
```

And this will give us persistence in all stores we make.

Hold on, isn't this all client side? Yes it is. So in the next part, let's see how we can connect our app to the server state and have it play well.
