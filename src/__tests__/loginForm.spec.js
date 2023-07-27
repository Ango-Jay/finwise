import { describe, it, expect } from 'vitest';
import {render, fireEvent, screen} from '@testing-library/vue'
import LoginVue from '../pages/Login.vue';

describe('Login form', () => {
  it('should have an email field', () => {
   render(LoginVue, {props:{}});
   const emailInput = screen.getByRole('textbox');
   expect(emailInput).toBeDefined();
  });

  // it('should have a password field', async() => {
  //   const wrapper = mount(LoginVue);
  //   const passwordInput = wrapper.find('input[type=password]');
  //   expect(passwordInput.exists()).toBeTruthy();
  // });

  // it('should submit the form when the submit button is clicked', () => {
  //   const wrapper = mount(LoginVue);
  //   const submitButton = wrapper.find('#submit');
  //   submitButton.trigger('click');
  //   expect(wrapper.vm.$emit('submit')).toBeTruthy();
  // });
});