/**
 * How every KeyboardAvoidingView in the app makes room for the on-screen
 * keyboard (#48).
 *
 * The usual advice is `undefined` on Android, leaving the system to resize the
 * window. Under the edge-to-edge layout that Expo SDK 57 uses, the window no
 * longer shrinks for the keyboard, so nothing moved and fields were covered.
 * `padding` makes the component measure the keyboard itself, on both platforms.
 *
 * Screens under the navigation header must also pass the header height as
 * `keyboardVerticalOffset`: the component compares the keyboard, in screen
 * coordinates, with its own frame, which starts below the header.
 */
export const KEYBOARD_BEHAVIOR = 'padding' as const;
