import { type Component } from 'solid-js'
import { Transition } from 'solid-transition-group'

export const KunFadeCard: Component<{ children?: any }> = (props) => {
  return (
    <Transition
      enterActiveClass="transition-all duration-300 ease-out"
      enterClass="opacity-0 max-h-0"
      exitToClass="opacity-0 max-h-0"
      exitActiveClass="transition-all duration-300 ease-in"
    >
      {props.children}
    </Transition>
  )
}

export default KunFadeCard
