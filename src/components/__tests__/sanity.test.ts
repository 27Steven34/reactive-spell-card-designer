import { test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../../views/HomeView.vue'

test('renders-welcome', () => {
  const wrapper = mount(HomeView)
  const welcome = wrapper.get('.home h1')

  expect(welcome.text()).toBe('Welcome!')
})
