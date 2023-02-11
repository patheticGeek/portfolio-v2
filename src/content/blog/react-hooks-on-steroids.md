---
title: 'React hooks on steroids'
description: ''
pubDate: 'Jul 17 2021'
heroImage: '/assets/blog/react-state-mgmt-on-crack.png'
---

# Introduction

This isn't going to be just another hooks and context tutorial, this is going to be me writing about how to do react hooks and state management like a pro. And, it can be a little too much to digest, so grab your favorite snack and jump in.
This will be a series of three posts which will take your react hook and state skills as high as I am while writing this.

> Hold on, if you don't know [the basics of react hooks](https://reactjs.org/docs/hooks-overview.html) and [react context API](https://reactjs.org/docs/context.html), I highly recommend learning about them first.

# 1. Setting the stage with hooks

So, we've been using react's new functional components and hooks for a while now, but how many of you have realized the actual power of hooks?

First, we will look at some places where a custom hook might be good and how we implement one.

## 1.1 A basic `useDarkMode` hook

So we're coders we love dark themes, but not everyone does, so we need to have some theme state in our app.
We will use the [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) to match a [CSS media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries) which is [prefers-color-scheme: dark](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme). This will tell us if the user's system theme is dark or not, and this will be our initial state.

```tsx
const matchDark = '(prefers-color-scheme: dark)'

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (process.browser) {
      return window.matchMedia && window.matchMedia(matchDark).matches
    }
    return false
  })

  return isDark
}

export default useDarkMode
```

## 1.2 Making `useDarkMode` actually useful

Now some people man… they just can't decide if they want light or dark theme, so they put it on auto. And now, we have to account for THAT in our applications.
How we do that is, we can attach a listener to `window.matchMedia` and listen for when it changes.
Now to do that in code…

```tsx
const matchDark = '(prefers-color-scheme: dark)'

const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (process.browser) {
      return window.matchMedia && window.matchMedia(matchDark).matches
    }
    return false
  })

  useEffect(() => {
    const matcher = window.matchMedia(matchDark)
    const onChange = ({ matches }: MediaQueryListEvent) => setIsDark(matches)
    matcher.addListener(onChange)
    return () => {
      matcher.removeListener(onChange)
    }
  }, [setIsDark])

  return isDark
}

export default useDarkMode
```

And now how will be using this hook will look something like

```tsx
import useDarkMode from '@hooks/useDarkMode'

const App = () => {
  const theme = useDarkMode() ? themes.dark : themes.light

  return <ThemeProvider value={theme}>...</ThemeProvider>
}
```

Now pat yourself on the back! You've made a useful custom hook.

## 1.3 The hook most needed `useInView`

One more common thing we often need is some way to detect if an element is in view or not. Here, most of us would find ourselves reaching for a library to do this but this is way simpler than it seems.

How to do this is simple:

1. We listen for scroll on window
2. We get the [bounding client rect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) of our element to get it's offset from top
3. We check if (offset of element from top + height of element) is > 0 and if the offset from top of element is < window's height, if both are true then our element is visible.
4. If state is not correct then we set the state and call the onChange function if present.

```tsx
const useInView = (
  elRef: MutableRefObject<HTMLElement | null>,
  onChange?: (_inView: boolean) => void
) => {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      if (!elRef.current) return

      const boundingRect = elRef.current.getBoundingClientRect()
      const elementHeight = elRef.current.offsetHeight
      const offsetTop = boundingRect.top
      const windowHeight = window.innerHeight
      const isVisible =
        offsetTop + elementHeight > 0 && offsetTop < windowHeight
      if (isVisible && !inView) {
        setInView(isVisible)
        onChange && onChange(isVisible)
      } else if (!isVisible && inView) {
        setInView(isVisible)
        onChange && onChange(isVisible)
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [elRef, onChange, inView])

  return inView
}
```

Using this hook is as simple as creating it

```tsx
import React, { useRef } from 'react'

import useInView from '@hooks/useInView'

const Hooks = () => {
  const elementRef = useRef<HTMLDivElement>(null)
  // use as a variable
  const inView = useInView(elementRef)
  // or use a callback
  useInView(elementRef, (isInView) => {
    console.log(isInView ? 'element has appeared' : 'element has disappeared')
  })

  return (
    <div className="w-full max-w-screen-md">
      <div className="h-screen"></div>
      <div
        ref={elementRef}
        className={`py-6 text-center ${inView ? 'bg-blue-100' : 'bg-red-100'}`}>
        Is in view: {inView ? 'true' : 'false'}
      </div>
      <div className="h-screen"></div>
    </div>
  )
}

export default Hooks
```

And now you can probably imagine all the places hooks can be useful. In the next part, we'll look at how to manage state in react apps without losing your sanity.
