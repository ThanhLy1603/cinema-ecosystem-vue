export function getInitials(fullName: string): string {
   const words: string[] = fullName
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
   const firstWord: string | undefined = words[0];
   const lastWord: string | undefined = words[words.length - 1];
   if (firstWord === undefined || lastWord === undefined) {
      return '?';
   }
   const initials: string = words.length === 1 ? firstWord.charAt(0) : firstWord.charAt(0) + lastWord.charAt(0);
   return initials.toUpperCase();
}
