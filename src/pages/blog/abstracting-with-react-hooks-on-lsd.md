---
layout: "../../layouts/BlogPost.astro"
title: "Abstracting with react hooks on LSD"
description: ""
pubDate: "Jul 19 2021"
heroImage: "/assets/blog/abstracting-with-react-hooks-on-lsd.png"
---

# 3. The final one, `useBusinessLogic` hook

Hooks are free of cost. i.e., you can make them really easily, and the only cost there is, is the cost of abstraction.

## 3.1 A basic `useTodos` hook

Now our components, they don't always just interact with the local state, most times they will be interacting with state on the server and managing async operations. And that's where the lines get blurry. So how about we put our hands in the magic pocket and try seeing if we have something that will help us?

Let's take an example of a basic to-do app, you'd be having a list of to-dos calling the APIs for getting it all that fun stuff, so let's extract it in a hook.

```jsx
const useTodos = () => {
  const todos = useTodosStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data: todos } = await axios.get("/api/todos");
      setTodos(todos);
      setError(null);
    } catch (e) {
      setError(e);
    }

    setIsLoading(false);
  });

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    fetch: fetchTodos,
    isLoading: false,
    error: null,
  };
};
```

If we need to change something, we can just change this small function, and it works everywhere as long as it returns the same object. Now we can just use this with one line of code wherever we want.

```jsx
const App = () => {
  const { todos, isLoading, error } = useTodos();

  // other stuff
};
```

## 3.2 Mutating to-dos

Now, let's say we want to toggle the state of a to-do. What do we do? We just put or hands in the custom hooks doremon pocket and bring out `useToggleTodo`

```jsx
const useToggleTodos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleTodo = useCallback(async (todoId) => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(`/api/todos/${todoId}/toggle`);
      setError(null);
      setIsLoading(false);
      return data;
    } catch (e) {
      setError(e);
    }

    setIsLoading(false);
  });

  return [toggleTodo, { isLoading, error }];
};
```

But wait, we also need to update things in our store and oh, what about having multiple useTodos. Do we have a global store or are all instances updated separately? What about race condition? And caching?

## 3.3 Doing it all right

Remember, our custom hooks can use other hooks too, so let's bring in [useQuery](https://react-query.tanstack.com/guides/queries) from [react-query](https://www.npmjs.com/package/react-query)

```jsx
import { useQuery } from "react-query"

const fetchTodos = () => axios.get('/api/todos').then(res => res.data())

const useTodos() => {
	const { data: todos, isLoading, error } = useQuery('todos', fetchTodos)

	return { todos, isLoading, error }
}
```

And in our `useToggleTodo` we can use the [useMutation](https://react-query.tanstack.com/guides/mutations) from `react-query` so that our to-dos query is re-fetched whenever we toggle a to-do

```jsx
import { useMutation } from "react-query";

const getToggleTodoById = (todoId) => axios.get(`/api/todos/${todoId}/toggle`);

const useToggleTodo = () => {
  return useMutation(getToggleTodoById, { refetchQueries: ["todos"] });
};
```

Look how we moved to using vanilla axios to `react-query` in seconds and didn't have to change more than a couple of lines. And now we have these nice hooks for our components to hooks into.

And my friends, that how we use hooks and manage like a pro (or from what all I know at least). Now you can go show off your new shiny gadgets to your friends _if you have any_.
