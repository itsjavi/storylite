declare module '@storylite/vite-plugin:stories' {
  const userStories: Map<string, { [exportName: string]: { [storyObjectProp: string]: any } }>
  export default userStories
}
