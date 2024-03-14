class PagesController < ApplicationController
  before_action :authenticate_user!

  def home
    @message = current_user.messages.build
    @messages = Message.all
  end
end
